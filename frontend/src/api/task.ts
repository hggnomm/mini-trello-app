import axiosInstance from "../utils/axios";

export interface Task {
  id: string;
  cardId: string;
  title: string;
  description?: string;
  status?: string;
  order: number;
  boardId: string;
  ownerId: string;
  assignedMembers: string[];
  githubAttachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const getTasks = async (boardId: string, cardId: string): Promise<Task[]> => {
  const response = await axiosInstance.get<Task[]>(`/boards/${boardId}/cards/${cardId}/tasks`);
  return response.data;
};

export const getBoardTasks = async (boardId: string): Promise<Task[]> => {
  const response = await axiosInstance.get<Task[]>(`/boards/${boardId}/tasks`);
  return response.data;
};

export const createTask = async (
  boardId: string,
  cardId: string,
  data: { title: string; description?: string; status?: string },
): Promise<Task> => {
  const response = await axiosInstance.post<Task>(`/boards/${boardId}/cards/${cardId}/tasks`, data);
  return response.data;
};

export const updateTask = async (
  boardId: string,
  cardId: string,
  taskId: string,
  data: { title?: string; description?: string; status?: string },
): Promise<Task> => {
  const response = await axiosInstance.put<Task>(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (boardId: string, cardId: string, taskId: string): Promise<void> => {
  await axiosInstance.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`);
};

export const reorderTasks = async (
  boardId: string,
  tasks: { id: string; cardId: string; order: number }[],
): Promise<void> => {
  await axiosInstance.put(`/boards/${boardId}/tasks/reorder`, { tasks });
};
