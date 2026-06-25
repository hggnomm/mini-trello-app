export type GitHubAttachmentType = "pull_request" | "commit" | "issue";

export interface GitHubAttachment {
  attachmentId: string;
  boardId: string;
  cardId: string;
  taskId: string;
  type: GitHubAttachmentType;
  number?: number;
  sha?: string;
  title?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}
