import { UserRepository } from "../repositories/user.repository";

const { Octokit } = require("@octokit/rest");

export interface GitHubRepoResponse {
  id: number;
  name: string;
  fullName: string;
  isPrivate: boolean;
  htmlUrl: string;
}

export interface IGitHubService {
  getUserRepositories(userId: string): Promise<GitHubRepoResponse[]>;
}

export class GitHubService implements IGitHubService {
  private userRepository = new UserRepository();

  async getUserRepositories(userId: string): Promise<GitHubRepoResponse[]> {
    const githubAccessToken = await this.userRepository.getGithubToken(userId);

    if (!githubAccessToken) {
      throw new Error("Unauthorized: GitHub account not linked");
    }


    const octokit = new Octokit({ auth: githubAccessToken });

    const { data } = await octokit.request("GET /user/repos", {
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
      per_page: 100,
      sort: "updated",
    });

    return (data as any[]).map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      isPrivate: repo.private,
      htmlUrl: repo.html_url,
    }));
  }
}
