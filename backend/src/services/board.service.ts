import { BoardRepository } from "../repositories/board.repository";
import { Board } from "../models/board.model";
import { getDb } from "../libs/firebase/firebase";

export interface IBoardService {
  createBoard(
    name: string,
    ownerId: string,
    description?: string,
  ): Promise<Board>;
  getAllBoards(): Promise<Board[]>;
  getAllBoardsCustom(): Promise<Board[]>;
  getBoardById(id: string): Promise<Board | null>;
  updateBoardById(id: string, data: Partial<Board>): Promise<Board>;
  deleteBoard(id: string): Promise<Board | null>;
}

export class BoardService implements IBoardService {
  private boardRepository = new BoardRepository();

  async createBoard(
    name: string,
    ownerId: string,
    description?: string,
  ): Promise<Board> {
    if (!name) {
      throw new Error("Board Name cannot be null");
    }
    if (!ownerId) {
      throw new Error("Owner Id cannot be null");
    }

    const dataBoard = {
      name: name,
      description: description || "",
      ownerId: ownerId,
      listMembers: {
        [ownerId]: "owner",
      },
    };

    return await this.boardRepository.create(dataBoard);
  }

  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.findAll();
  }

  async getAllBoardsCustom(): Promise<Board[]> {
    // just return 3 fields like SKIPLI documents provived
    const snapshot = await getDb().collection("boards").get();

    const boards: Board[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.get("name"),
      ownerId: doc.get("ownerId"),
    }));

    return boards;
  }

  async getBoardById(id: string): Promise<Board | null> {
    return await this.boardRepository.findById(id);
  }

  async updateBoardById(id: string, data: Partial<Board>): Promise<Board> {
    return await this.boardRepository.update(id, data);
  }

  async deleteBoard(id: string): Promise<Board | null> {
    return await this.boardRepository.delete(id);
  }
}
