import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/search", requireAuth, userController.searchUsers);
router.get("/github/user-repositories", requireAuth, userController.getUserRepos);

export default router;
