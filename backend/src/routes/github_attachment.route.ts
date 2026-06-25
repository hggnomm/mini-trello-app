import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { GitHubAttachmentController } from "../controllers/github_attachment.controller";

const router = Router();
const controller = new GitHubAttachmentController();

router.use(requireAuth);

router.get("/:boardId/cards/:cardId/tasks/:taskId/github-attachments", controller.getAttachments);
router.post("/:boardId/cards/:cardId/tasks/:taskId/github-attach", controller.attach);
router.delete("/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId", controller.remove);

export default router;
