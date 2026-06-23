import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/send-otp", authController.sendOTP);


router.get("/github", authController.githubSignIn);

// change on frontend after
router.get("/github/callback", authController.githubCallback);


export default router;
