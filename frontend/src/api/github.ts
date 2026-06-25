import axiosInstance from "../utils/axios";

export interface GitHubUserRepository {
  id: number;
  name: string;
  fullName: string;
  isPrivate: boolean;
  htmlUrl: string;
}

export const getUserRepositories = async (): Promise<GitHubUserRepository[]> => {
  const response = await axiosInstance.get<GitHubUserRepository[]>("users/github/user-repositories");
  return response.data;
};
