import { settings } from "../utils/settings";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { sendMail } from "../libs/nodemailer/nodemailer";
import { Timestamp } from "@google-cloud/firestore";
import { logger } from "../utils/logger";
var jwt = require("jsonwebtoken");

export interface IAuthService {
  signUp(email: string, verifyCode: number): Promise<User>;
  signIn(email: string, verifyCode: number): Promise<string>;
  sendOTP(email: string): Promise<void>;
}

export class AuthService implements IAuthService {
  private userRepository = new UserRepository();

  async signUp(email: string, verifyCode: number): Promise<User> {
    if (!email) throw new Error("Email cannot be null");
    if (!verifyCode) throw new Error("Verification code is required");

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) throw new Error("User not in the system");

    if (user.isVerified) throw new Error("User is already in system");

    await this.verifyOTP(user, verifyCode);

    const updatedUser = await this.userRepository.update(user.id, {
      isVerified: true,
    });

    return updatedUser;
  }

  async signIn(email: string, verifyCode: number): Promise<string> {
    if (!email) throw new Error("Email cannot be null");
    if (!verifyCode) throw new Error("Verification code is required");

    const user = await this.userRepository.findUserByEmail(email);

    if (!user || !user.isVerified) {
      throw new Error("Invalid email or verification code");
    }

    logger.info(user);

    await this.verifyOTP(user, verifyCode);

    const jwtSecret = settings.JWT_SECRET;

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "10d" });

    return accessToken;
  }

  async sendOTP(email: string): Promise<void> {
    if (!email) throw new Error("Email cannot be null");

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // expired 5 minutes
    const expiryTime = Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000));

    let user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      const newUserData: Omit<User, "id"> = {
        email: email,
        name: email.split("@")[0],
        role: "user",
        isVerified: false,
        verifyCode: otpCode,
        codeExpiryTime: expiryTime,
      };
      user = await this.userRepository.create(newUserData);
    } else {
      await this.userRepository.update(user.id, {
        verifyCode: otpCode,
        codeExpiryTime: expiryTime,
      });
    }

    // Send OTP email
    const subject = "Your Verification Code - Mini Trello App";
    const message = `Your verification code is: ${otpCode}. It is valid for 5 minutes.`;

    await sendMail(email, subject, message);
  }

  private async verifyOTP(user: User, code: number): Promise<User> {
    logger.warn(user);

    if (user.verifyCode !== code) {
      throw new Error("Invalid verify code");
    }

    if (user.codeExpiryTime) {
      if (user.codeExpiryTime.toDate() < new Date()) {
        throw new Error("Verify code has expired");
      }
    } else {
      throw new Error("Verify code has expired or is invalid");
    }

    // Remove OTP after user login or register success
    const updatedUser = await this.userRepository.update(user.id, {
      verifyCode: null,
      codeExpiryTime: null,
    });

    return updatedUser;
  }
}
