import { Router } from 'express';
import { BoardController } from '../controllers/board.controller';

const router = Router();
const boardController = new BoardController();

router.get('/', boardController.getAllBoards);
router.post('/', boardController.createBoard);
router.get('/:id', boardController.getBoardById);
router.put('/:id', boardController.updateBoardById);

export default router;
