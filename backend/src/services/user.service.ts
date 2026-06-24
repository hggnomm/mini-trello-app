import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

export interface IUserService {
  searchVerifiedUsers(query: string): Promise<Partial<User>[]>;
}

export class UserService implements IUserService {
  private userRepository = new UserRepository();

  async searchVerifiedUsers(query: string): Promise<Partial<User>[]> {
    const users = await this.userRepository.searchVerifiedUsers(query);

    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        githubId: user.githubId,
        githubName: user.githubName,
      };
    });
  }
}
