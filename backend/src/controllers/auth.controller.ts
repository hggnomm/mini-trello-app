import { Request, Response } from "express";
import { AuthService, IAuthService } from "../services/auth.service";

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
}
