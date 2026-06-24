import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-user", authController.verifyUser);

router.get("/github", authController.githubSignIn);

router.get("/github/link", requireAuth, authController.githubLink);

router.post("/github/exchange", requireAuth, authController.githubExchange);

router.get("/profile", requireAuth, authController.profile);

export default router;
