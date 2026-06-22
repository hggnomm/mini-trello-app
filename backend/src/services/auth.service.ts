import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
var jwt = require("jsonwebtoken");

export interface IAuthService {
  signUp(email: string, verifyCode: number): Promise<User>;
  signIn(email: string, verifyCode: number): Promise<User>;
  sendOTP(email: string): Promise<void>;
  verifyOTP(
    email: string,
    code: number,
  ): Promise<{ token: string; user: User }>;
}

export class AuthService implements IAuthService {
  private userRepository = new UserRepository();

  async signUp(email: string, verifyCode: number): Promise<User> {
    if (!email) throw new Error("Emaill cannot be null");

    // pass verify code, after implement then

    const user = await this.userRepository.findUserByEmail(email);

    if (user) throw new Error("User is already in system");

    const newUserData: Omit<User, "id"> = {
      email: email,
      name: email.split("@")[0],
      role: "user",
      isVerified: true,
    };

    const newUser = await this.userRepository.create(newUserData);

    return newUser;
  }

  async signIn(email: string, verifyCode: number): Promise<User> {
    if (!email) throw new Error("Emaill cannot be null");

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) throw new Error("Invalid email or verification code");

    // pass verify code, implement then

    const jwtSecret = process.env.JWT_SECRET ?? "123123123";

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "10d" });

    return accessToken;
  }

  sendOTP(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  verifyOTP(
    email: string,
    code: number,
  ): Promise<{ token: string; user: User }> {
    throw new Error("Method not implemented.");
  }
}
