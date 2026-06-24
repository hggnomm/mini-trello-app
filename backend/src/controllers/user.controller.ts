import { Request, Response } from "express";
import { IUserService, UserService } from "../services/user.service";

export class UserController {
  private userService: IUserService = new UserService();

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      const users = await this.userService.searchVerifiedUsers(
        (q as string) ?? "",
      );

      res.status(200).json(users);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
}
