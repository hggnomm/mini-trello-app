import { Filter } from "@google-cloud/firestore";
import { BaseRepository } from "./index";
import { Board } from "../models/board.model";

export class BoardRepository extends BaseRepository {
  constructor() {
    super("boards");
  }

  async getAllBoardsCustom(userId: string): Promise<Board[]> {
    const snapshot = await this.getCollection()
      .where(
        Filter.or(
          Filter.where("ownerId", "==", userId),
          Filter.where(`listMembers.${userId}`, "==", "accepted")
        )
      )
      .get();

    const boards: Board[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        boards.push({
          id: doc.id,
          name: data.name,
          ownerId: data.ownerId,
        });
      }
    });

    return boards;
  }
}
