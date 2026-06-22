import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const taskController = new TaskController();

router.use(requireAuth);

router.post("/:boardId/cards/:id/tasks", taskController.createCard);
router.get("/:boardId/cards/:id/tasks", taskController.getAllTasks);

export default router;
