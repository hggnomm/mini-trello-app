import axiosInstance from "../utils/axios";

export type GitHubAttachmentType = "pull_request" | "commit" | "issue";

export interface GitHubAttachment {
  attachmentId: string;
  taskId: string;
  type: GitHubAttachmentType;
  number?: number;
  sha?: string;
  title?: string;
  url?: string;
}

export async function getGithubAttachments(taskId: string): Promise<GitHubAttachment[]> {
  const response = await axiosInstance.get<GitHubAttachment[]>(`/tasks/${taskId}/github-attachments`);
  return response.data;
}

export async function attachGithubItem(
  taskId: string,
  body: { type: GitHubAttachmentType; number?: number; sha?: string; title?: string; url?: string },
): Promise<{ attachmentId: string }> {
  const response = await axiosInstance.post<{ attachmentId: string }>(`/tasks/${taskId}/github-attach`, body);
  return response.data;
}

export async function removeGithubAttachment(taskId: string, attachmentId: string): Promise<void> {
  await axiosInstance.delete(`/tasks/${taskId}/github-attachments/${attachmentId}`);
}
