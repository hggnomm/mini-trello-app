import { Request, Response } from "express";
import { BoardService } from "../services/board.service";

export class BoardController {
  private boardService = new BoardService();

  createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, ownerId } = req.body;
      const newBoard = await this.boardService.createBoard(
        name,
        ownerId,
        description,
      );
      res.status(201).json(newBoard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllBoards = async (req: Request, res: Response): Promise<void> => {
    try {
      const boards = await this.boardService.getAllBoards();
      res.status(200).json(boards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
