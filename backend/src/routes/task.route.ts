import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const taskController = new TaskController();

router.use(requireAuth);

router.post("/:boardId/cards/:cardId/tasks", taskController.createCard);
router.get("/:boardId/cards/:cardId/tasks", taskController.getAllTasks);
router.get("/:boardId/cards/:cardId/tasks/:taskId", taskController.getTaskById);
router.put("/:boardId/cards/:cardId/tasks/:taskId", taskController.updateTask);

export default router;
