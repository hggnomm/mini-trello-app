import { GitHubAttachmentRepository } from "../repositories/github_attachment.repository";
import { GitHubAttachment, GitHubAttachmentType } from "../models/github_attachment.model";

export class GitHubAttachmentService {
  private repository = new GitHubAttachmentRepository();

  async getAttachments(boardId: string, cardId: string, taskId: string): Promise<GitHubAttachment[]> {
    return this.repository.findByTask(boardId, cardId, taskId);
  }

  async attach(
    boardId: string,
    cardId: string,
    taskId: string,
    body: { type: GitHubAttachmentType; number?: number; sha?: string; title?: string; url?: string },
  ): Promise<GitHubAttachment> {
    return this.repository.create({ boardId, cardId, taskId, ...body });
  }

  async remove(attachmentId: string): Promise<void> {
    return this.repository.delete(attachmentId);
  }
}
