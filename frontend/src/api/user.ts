import axiosInstance from "../utils/axios";

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  githubId?: string;
  githubName?: string;
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  const response = await axiosInstance.get(`/users/search`, {
    params: { q: query },
  });
  return response.data;
};
