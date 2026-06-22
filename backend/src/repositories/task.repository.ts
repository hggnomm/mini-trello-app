import { BaseRepository } from ".";

export class TaskRepository extends BaseRepository {
  constructor() {
    super("tasks");
  }

  async countByCardId(cardId: string): Promise<number> {
    const snapshot = await this.getCollection()
      .where("cardId", "==", cardId)
      .get();
    return snapshot.size;
  }
}
