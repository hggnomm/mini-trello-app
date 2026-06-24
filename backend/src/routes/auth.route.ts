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

// change on frontend after
router.get("/github/callback", authController.githubCallback);

router.get("/profile", requireAuth, authController.profile);

export default router;
