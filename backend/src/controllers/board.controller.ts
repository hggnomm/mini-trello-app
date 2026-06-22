import { Request, Response } from "express";
import { BoardService, IBoardService } from "../services/board.service";
import { Board } from "../models/board.model";
import { getAuthenticatedUser } from "../utils/auth";

export class BoardController {
  private boardService: IBoardService = new BoardService();

  createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body;
      const user = getAuthenticatedUser(req);

      const newBoard = await this.boardService.createBoard(
        name,
        user.id,
        description,
      );
      res.status(201).json(newBoard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllBoards = async (req: Request, res: Response): Promise<void> => {
    try {
      const boards = await this.boardService.getAllBoardsCustom();
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
        .json({ updatedBoard, message: "Board successfully updated" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const board = await this.boardService.getBoardById(id);
      if (!board) {
        res.status(404).json({ error: "Board not found" });
        return;
      }

      await this.boardService.deleteBoard(id);

      res.status(204).json({ message: "Board successfully deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
