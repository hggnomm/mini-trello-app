import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const taskController = new TaskController();

router.use(requireAuth);

router.get("/:boardId/tasks", taskController.getBoardTasks);
router.put("/:boardId/tasks/reorder", taskController.reorderTasks);

router.post("/:boardId/cards/:cardId/tasks", taskController.createCard);
router.get("/:boardId/cards/:cardId/tasks", taskController.getAllTasks);
router.get("/:boardId/cards/:cardId/tasks/:taskId", taskController.getTaskById);
router.put("/:boardId/cards/:cardId/tasks/:taskId", taskController.updateTask);
router.delete("/:boardId/cards/:cardId/tasks/:taskId", taskController.deleteTask);
router.post(
  "/:boardId/cards/:cardId/tasks/:taskId/assign",
  taskController.assignMemberToTask,
);
router.get(
  "/:boardId/cards/:cardId/tasks/:taskId/assign",
  taskController.getAllMembersOfTask,
);
router.delete(
  "/:boardId/cards/:cardId/tasks/:taskId/assign/:memberId",
  taskController.removeMemberFromTask,
);

export default router;
