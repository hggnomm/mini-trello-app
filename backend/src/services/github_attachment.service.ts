import { GitHubAttachmentRepository } from "../repositories/github_attachment.repository";
import {
  GitHubAttachment,
  GitHubAttachmentType,
} from "../models/github_attachment.model";

export interface IGitHubAttachmentService {
  getAttachments(taskId: string): Promise<GitHubAttachment[]>;
  attach(
    taskId: string,
    body: {
      type: GitHubAttachmentType;
      number?: number;
      sha?: string;
      title?: string;
      url?: string;
    },
  ): Promise<GitHubAttachment>;
  remove(taskId: string, attachmentId: string): Promise<void>;
}

export class GitHubAttachmentService {
  private repository = new GitHubAttachmentRepository();

  async getAttachments(taskId: string): Promise<GitHubAttachment[]> {
    return this.repository.findByTask(taskId);
  }

  async attach(
    taskId: string,
    body: {
      type: GitHubAttachmentType;
      number?: number;
      sha?: string;
      title?: string;
      url?: string;
    },
  ): Promise<GitHubAttachment> {
    return this.repository.create({ taskId, ...body });
  }

  async remove(taskId: string, attachmentId: string): Promise<void> {
    const attachments = await this.repository.findByTask(taskId);
    const attachment = attachments.find((a) => a.attachmentId === attachmentId);

    if (!attachment) throw new Error("Attachment not found");

    await this.repository.delete(attachmentId);
  }
}
