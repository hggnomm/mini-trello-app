import axiosInstance from "../utils/axios";

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
}

export async function getGithubAttachments(boardId: string, cardId: string, taskId: string): Promise<GitHubAttachment[]> {
  const response = await axiosInstance.get<GitHubAttachment[]>(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments`,
  );
  return response.data;
}

export async function attachGithubItem(
  boardId: string,
  cardId: string,
  taskId: string,
  body: { type: GitHubAttachmentType; number?: number; sha?: string; title?: string; url?: string },
): Promise<{ attachmentId: string }> {
  const response = await axiosInstance.post<{ attachmentId: string }>(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attach`,
    body,
  );
  return response.data;
}

export async function removeGithubAttachment(boardId: string, cardId: string, taskId: string, attachmentId: string): Promise<void> {
  await axiosInstance.delete(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments/${attachmentId}`,
  );
}
