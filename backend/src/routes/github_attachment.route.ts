import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { GitHubAttachmentController } from "../controllers/github_attachment.controller";

const router = Router();
const controller = new GitHubAttachmentController();

router.use(requireAuth);

router.get("/:taskId/github-attachments", controller.getAttachments);
router.post("/:taskId/github-attach", controller.attach);
router.delete("/:taskId/github-attachments/:attachmentId", controller.remove);

export default router;
