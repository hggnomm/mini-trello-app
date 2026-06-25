import { UserRepository } from "../repositories/user.repository";
import { BoardRepository } from "../repositories/board.repository";

const { Octokit } = require("@octokit/rest");

export interface GitHubRepoResponse {
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
}

export interface GitHubIssue {
  number: number;
  title: string;
  state: string;
  url: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  url: string;
  authorName: string;
}

export interface GitHubRepoInfo {
  repositoryId: string;
  repoName: string;
  branches: GitHubBranch[];
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  commits: GitHubCommit[];
}

export interface IGitHubService {
  getUserRepositories(userId: string): Promise<GitHubRepoResponse[]>;
  getRepoInfo(
    userId: string,
    boardId: string,
    repositoryId: string,
  ): Promise<GitHubRepoInfo>;
}

export class GitHubService implements IGitHubService {
  private readonly userRepository = new UserRepository();

  private readonly boardRepository = new BoardRepository();

  private async getOctokitForUser(userId: string) {
    const githubAccessToken = await this.userRepository.getGithubToken(userId);

    if (!githubAccessToken) {
      throw new Error("Unauthorized: GitHub account not linked");
    }

    return new Octokit({
      auth: githubAccessToken,
    });
  }

  private async getRepoFromBoard(boardId: string, repositoryId: string) {
    const board = await this.boardRepository.findById(boardId);
    if (!board) return null;
    if (board.githubRepository?.id?.toString() !== repositoryId) return null;
    return board.githubRepository;
  }

  async getUserRepositories(userId: string): Promise<GitHubRepoResponse[]> {
    const octokit = await this.getOctokitForUser(userId);

    const { data } = await octokit.request("GET /user/repos", {
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
      per_page: 100,
      sort: "updated",
    });

    return data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      isPrivate: repo.private,
      htmlUrl: repo.html_url,
    }));
  }

  async getRepoInfo(
    userId: string,
    boardId: string,
    repositoryId: string,
  ): Promise<GitHubRepoInfo> {
    const repoMeta = await this.getRepoFromBoard(boardId, repositoryId);

    if (!repoMeta) {
      throw new Error("Repository not found in any board");
    }

    const [owner, repoName] = repoMeta.fullName.split("/");

    const octokit = await this.getOctokitForUser(userId);

    const [
      branchesResponse,
      pullRequestsResponse,
      issuesResponse,
      commitsResponse,
    ] = await Promise.all([
      octokit.request("GET /repos/{owner}/{repo}/branches", {
        owner,
        repo: repoName,
        per_page: 20,
      }),

      octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner,
        repo: repoName,
        state: "open",
        per_page: 20,
      }),

      octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner,
        repo: repoName,
        state: "open",
        per_page: 20,
      }),

      octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner,
        repo: repoName,
        per_page: 20,
      }),
    ]);

    return {
      repositoryId,
      repoName,

      branches: branchesResponse.data.map((branch: any) => ({
        name: branch.name,
        sha: branch.commit.sha,
      })),

      pullRequests: pullRequestsResponse.data.map((pr: any) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        url: pr.html_url,
      })),

      issues: issuesResponse.data
        .filter((issue: any) => !issue.pull_request)
        .map((issue: any) => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          url: issue.html_url,
        })),

      commits: commitsResponse.data.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message.split("\n")[0],
        url: commit.html_url,
        authorName: commit.commit.author?.name ?? "Unknown",
      })),
    };
  }
}
