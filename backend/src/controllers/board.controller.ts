import { Request, Response } from "express";
import { BoardService } from "../services/board.service";
import { Board } from "../models/board.model";

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

  getBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const board = await this.boardService.getBoardById(id);
      if (!board) {
        res.status(404).json({ msg: "Board not found" });
        return;
      }
      res.status(200).json(board);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const board = await this.boardService.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found" });
        return;
      }
      
      const updatedBoard = await this.boardService.updateBoardById(id, {
        ...req.body,
      });

      res
        .status(200)
        .json({ updatedBoard, message: "Board updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
