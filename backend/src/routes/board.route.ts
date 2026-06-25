import { Router } from "express";
import { BoardController } from "../controllers/board.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
const boardController = new BoardController();


router.get("/:boardId/invite/accept", boardController.acceptBoardInvitation);

router.use(requireAuth);

router.get("/", boardController.getAllBoards);
router.post("/", boardController.createBoard);
router.get("/:id", boardController.getBoardById);
router.get("/:id/members", boardController.getBoardMembers);
router.put("/:id", boardController.updateBoardById);
router.delete("/:id", boardController.deleteBoard);

router.post("/:boardId/invite", boardController.inviteUserToBoard);
router.get("/:boardId/repositories/:repositoryId/github-info", boardController.getBoardRepositoryInfo);

export default router;
