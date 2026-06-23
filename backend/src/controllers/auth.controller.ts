import { Request, Response } from "express";
import { AuthService, IAuthService } from "../services/auth.service";
import { isEmail } from "../utils/email";

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

  githubCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code) {
        throw new Error("Authorization code is required");
      }

      const user = await this.authService.signInWithGithub(code as string);

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          githubId: user.githubId,
          githubName: user.githubName,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
