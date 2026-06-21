import { Router } from 'express';
import { BoardController } from '../controllers/board.controller';

const router = Router();
const boardController = new BoardController();

router.get('/', boardController.getAllBoards);
router.post('/', boardController.createBoard);

export default router;
