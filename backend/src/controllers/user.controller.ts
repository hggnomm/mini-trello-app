import { Request, Response } from "express";
import { IUserService, UserService } from "../services/user.service";
import { IGitHubService, GitHubService } from "../services/github.service";

export class UserController {
  private userService: IUserService = new UserService();
  private githubService: IGitHubService = new GitHubService();

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

  getUserRepos = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const repos = await this.githubService.getUserRepositories(userId);
      res.status(200).json(repos);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
}
