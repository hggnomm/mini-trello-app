import { BoardRepository } from "../repositories/board.repository";
import { Board } from "../models/board.model";

export class BoardService {
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
