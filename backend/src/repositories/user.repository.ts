import { BaseRepository } from ".";
import { User } from "../models/user.model";

export class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const snapshot_user_result = await this.getCollection()
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot_user_result.empty) return null;

    return snapshot_user_result.docs[0].data() as User;
  }

  async findUserByGithubId(githubId: string): Promise<User | null> {
    const snapshot_user_result = await this.getCollection()
      .where("githubId", "==", githubId)
      .limit(1)
      .get();

    if (snapshot_user_result.empty) return null;

    return snapshot_user_result.docs[0].data() as User;
  }

  async searchVerifiedUsers(query: string): Promise<User[]> {
    const q = query.toLowerCase().trim();

    const snapshot = await this.getCollection()
      .where("isVerified", "==", true)
      .get();

    const users: User[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as User;
      if (
        data.email.toLowerCase().includes(q) ||
        (data.name && data.name.toLowerCase().includes(q))
      ) {
        users.push(data);
      }
    });

    return users;
  }
}
