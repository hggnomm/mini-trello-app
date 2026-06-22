import { BaseRepository } from "./index";
import { Card } from "../models/card.model";

export class CardRepository extends BaseRepository {
  constructor() {
    super("cards");
  }
  async findCardsByBoardIdAndOwnerId(
    boardId: string,
    ownerId: string,
  ): Promise<Card[]> {
    const snapshot = await this.getCollection()
      .where("boardId", "==", boardId)
      .where("ownerId", "==", ownerId)
      .get();

    const cards: Card[] = [];

    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data) {
        cards.push(data as Card);
      }
    });
    return cards;
  }

  async findCardsByBoardId(boardId: string): Promise<Card[]> {
    const snapshot = await this.getCollection()
      .where("boardId", "==", boardId)
      .get();

    const cards: Card[] = [];

    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data) {
        cards.push(data as Card);
      }
    });
    return cards;
  }
}
