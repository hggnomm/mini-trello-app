import axiosInstance from "../utils/axios";

export interface Board {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  githubRepositoryId?: string;
  listMembers?: Record<string, "accepted" | "pending" | "declined">;
  createdAt?: string;
  updatedAt?: string;
}

export const getBoards = async (): Promise<Board[]> => {
  const response = await axiosInstance.get<Board[]>("/boards");
  return response.data;
};

export const createBoard = async (data: { name: string; description?: string }): Promise<Board> => {
  const response = await axiosInstance.post<Board>("/boards", data);
  return response.data;
};

export const getBoardById = async (id: string): Promise<Board> => {
  const response = await axiosInstance.get<Board>(`/boards/${id}`);
  return response.data;
};

export const updateBoard = async (
  id: string,
  data: { name?: string; description?: string }
): Promise<{ updatedBoard: Board; message: string }> => {
  const response = await axiosInstance.put<{ updatedBoard: Board; message: string }>(`/boards/${id}`, data);
  return response.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/boards/${id}`);
};
