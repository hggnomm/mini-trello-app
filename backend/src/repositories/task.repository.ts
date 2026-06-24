import { BaseRepository } from ".";
import { Task } from "../models/task.model";

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

  async findTasksByCardId(cardId: string): Promise<Task[]> {
    const snapshot = await this.getCollection()
      .where("cardId", "==", cardId)
      .get();

    const tasks: Task[] = [];
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data) {
        tasks.push(data as Task);
      }
    });
    return tasks;
  }

  async findTasksByBoardId(boardId: string): Promise<Task[]> {
    const snapshot = await this.getCollection()
      .where("boardId", "==", boardId)
      .get();

    const tasks: Task[] = [];
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data) {
        tasks.push(data as Task);
      }
    });
    return tasks;
  }
}
