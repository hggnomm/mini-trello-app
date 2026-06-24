import { Request, Response } from "express";
import { AuthService, IAuthService } from "../services/auth.service";
import { isEmail } from "../utils/email";
import { getAuthenticatedUser } from "../utils/auth";

export class AuthController {
  private authService: IAuthService = new AuthService();

  signUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, verifyCode } = req.body;

      const user = await this.authService.signUp(email, verifyCode);

      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  signIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, verifyCode } = req.body;

      const accessToken = await this.authService.signIn(email, verifyCode);

      res.status(200).json({
        accessToken: accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!isEmail(email)) {
        throw new Error("Email format not true");
      }

      await this.authService.sendOTP(email);

      res.status(200).json({
        message: "OTP code sent to email successfully",
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  githubSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const githubUrl = this.authService.getGithubSignInUrl();
      res.redirect(githubUrl);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  githubLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      
      const url = this.authService.getLinkGithubUrl(authenticatedUser.id);

      res.status(200).json({ url });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  githubExchange = async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);
      
      const { code } = req.body;

      if (!code) {
        throw new Error("Authorization code is required");
      }

      const user = await this.authService.linkGithub(
        authenticatedUser.id,
        code,
      );

      res.status(200).json({
        githubName: user.githubName,
        githubId: user.githubId,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, mode } = req.body;

      if (!isEmail(email)) {
        throw new Error("Email format not true");
      }

      await this.authService.verifyUser(email, mode);

      res.status(200).json({
        message: "User verified successfully",
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedUser = getAuthenticatedUser(req);

      const user = await this.authService.getProfile(authenticatedUser.id);

      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        githubId: user.githubId ?? null,
        githubName: user.githubName ?? null,
        isGithubLinked: !!user.githubId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}
