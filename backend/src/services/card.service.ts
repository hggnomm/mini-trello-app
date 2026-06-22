import { CardRepository } from "../repositories/card.repository";
import { BoardRepository } from "../repositories/board.repository";
import { Card } from "../models/card.model";

export interface CreateCardInput {
  boardId: string;
  ownerId: string;
  name: string;
  description?: string;
}

export interface ICardService {
  createCard(input: CreateCardInput): Promise<Card>;
  getAllCards(boardId: string): Promise<Card[]>;
}

export class CardService implements ICardService {
  private cardRepository = new CardRepository();
  private boardRepository = new BoardRepository();

  async createCard(input: CreateCardInput): Promise<Card> {
    const { boardId, ownerId, name, description } = input;

    if (!name) throw new Error("Card Name cannot be null");
    if (!boardId) throw new Error("Board Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);

    if (!boardDoc) throw new Error("Board not found");

    const dataCard = {
      boardId: boardId,
      name: name,
      description: description || "",
      ownerId: ownerId,
    };

    return await this.cardRepository.create(dataCard);
  }

  async getAllCards(boardId: string): Promise<Card[]> {
    if (!boardId) throw new Error("Board Id cannot be null");

    const boardDoc = await this.boardRepository.findById(boardId);
    if (!boardDoc) throw new Error("Board not found");

    return await this.cardRepository.findCardsByBoardId(boardId);
  }
}
