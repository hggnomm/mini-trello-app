import { BaseRepository } from "./index";
import { GitHubAttachment } from "../models/github_attachment.model";

export class GitHubAttachmentRepository extends BaseRepository {
  constructor() {
    super("github_attachments");
  }

  async findByTask(
    boardId: string,
    cardId: string,
    taskId: string,
  ): Promise<GitHubAttachment[]> {
    const snapshot = await this.getCollection()
      .where("boardId", "==", boardId)
      .where("cardId", "==", cardId)
      .where("taskId", "==", taskId)
      .get();

    const items: GitHubAttachment[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data)
        items.push({ ...data, attachmentId: doc.id } as GitHubAttachment);
    });

    return items;
  }

  async create(
    data: Omit<GitHubAttachment, "attachmentId" | "createdAt" | "updatedAt">,
  ): Promise<GitHubAttachment> {
    const docRef = this.getCollection().doc();
    const now = new Date().toISOString();

    const item = {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as GitHubAttachment;
    
    await docRef.set(item);

    return { ...item, attachmentId: docRef.id };
  }

  async delete(attachmentId: string): Promise<void> {
    await this.getCollection().doc(attachmentId).delete();
  }
}
