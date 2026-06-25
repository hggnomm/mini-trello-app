import axiosInstance from "../utils/axios";

export interface GitHubRepository {
  id: string | number;
  fullName: string;
  url: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  githubRepository?: GitHubRepository;
  listMembers?: Record<string, "accepted" | "pending" | "declined">;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardMember {
  id: string;
  name: string;
  email: string;
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

export const getBoardMembers = async (id: string): Promise<BoardMember[]> => {
  const response = await axiosInstance.get<BoardMember[]>(`/boards/${id}/members`);
  return response.data;
};

export const inviteUserToBoard = async (
  boardId: string,
  data: { board_owner_id: string; member_id?: string; email_member?: string },
): Promise<{ success: boolean }> => {
  const response = await axiosInstance.post<{ success: boolean }>(`/boards/${boardId}/invite`, data);
  return response.data;
};

export const acceptBoardInvitation = async (
  boardId: string,
  memberId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.get<{ success: boolean; message: string }>(
    `/boards/${boardId}/invite/accept?memberId=${memberId}`,
  );
  return response.data;
};

export const updateBoard = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    githubRepository?: GitHubRepository | null;
  },
): Promise<{ updatedBoard: Board; message: string }> => {
  const response = await axiosInstance.put<{ updatedBoard: Board; message: string }>(`/boards/${id}`, data);
  return response.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/boards/${id}`);
};
