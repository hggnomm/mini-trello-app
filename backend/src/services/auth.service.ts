import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

export interface IAuthService {

  signUp(email: string, verifyCode: number): Promise<User>;
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

}
