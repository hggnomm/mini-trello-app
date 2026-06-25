import axiosInstance from "../utils/axios";

export interface GitHubUserRepository {
  id: number;
  name: string;
  fullName: string;
  isPrivate: boolean;
  htmlUrl: string;
}

export interface GitHubBranch {
  name: string;
  sha: string;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubIssue {
  number: number;
  title: string;
  state: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  url: string;
  authorName: string;
  createdAt: string;
}

export interface GitHubRepoInfo {
  repositoryId: string;
  repoName: string;
  branches: GitHubBranch[];
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  commits: GitHubCommit[];
}

export const getUserRepositories = async (): Promise<GitHubUserRepository[]> => {
  const response = await axiosInstance.get<GitHubUserRepository[]>("users/github/user-repositories");
  return response.data;
};

export const getRepoGitHubInfo = async (boardId: string, repositoryId: string): Promise<GitHubRepoInfo> => {
  const response = await axiosInstance.get<GitHubRepoInfo>(
    `/boards/${boardId}/repositories/${repositoryId}/github-info`,
  );
  return response.data;
};
