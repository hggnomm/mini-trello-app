import { CardRepository } from "../repositories/card.repository";
import { BoardRepository } from "../repositories/board.repository";
import { Card } from "../models/card.model";
import { logger } from "../utils/logger";
import { getDb } from "../libs/firebase/firebase";

export interface ICardService {
  createCard(
    ownerId: string,
    boardId: string,
    name: string,
    description?: string,
  ): Promise<Card>;
}

export class CardService implements ICardService {
  private cardRepository = new CardRepository();
  private boardRepository = new BoardRepository();

  async createCard(
    boardId: string,
    onwerId: string,
    name: string,
    description?: string,
  ): Promise<Card> {
    if (!name) throw new Error("Card Name cannot be null");

    if (!boardId) throw new Error("Board Id cannot be null");

    const boardDoc = await getDb().collection("boards").doc(boardId).get();

    logger.warn(boardId);

    if (!boardDoc) throw new Error("Board not found");

    const dataCard = {
      boardId: boardId,
      name: name,
      description: description || "",
      onwerId: onwerId,
    };

    return await this.cardRepository.create(dataCard);
  }
}
