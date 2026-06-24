import axiosInstance from "../utils/axios";

export interface Card {
  id: string;
  name: string;
  description?: string;
  boardId?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardByUser {
  id: string;
  name: string;
  description?: string;
  tasks_count: number;
  list_member: string[];
  createdAt: string;
}

export const getCards = async (boardId: string): Promise<Card[]> => {
  const response = await axiosInstance.get<Card[]>(`/boards/${boardId}/cards`);
  return response.data;
};

export const getCardsByUser = async (boardId: string, userId: string): Promise<CardByUser[]> => {
  const response = await axiosInstance.get<CardByUser[]>(`/boards/${boardId}/cards/user/${userId}`);
  return response.data;
};

export const getCardById = async (boardId: string, cardId: string): Promise<Card> => {
  const response = await axiosInstance.get<Card>(`/boards/${boardId}/cards/${cardId}`);
  return response.data;
};

export const createCard = async (boardId: string, data: { name: string; description?: string }): Promise<Card> => {
  const response = await axiosInstance.post<Card>(`/boards/${boardId}/cards`, data);
  return response.data;
};

export const updateCard = async (
  boardId: string,
  cardId: string,
  data: { name?: string; description?: string },
): Promise<Card> => {
  const response = await axiosInstance.put<Card>(`/boards/${boardId}/cards/${cardId}`, data);
  return response.data;
};

export const deleteCard = async (boardId: string, cardId: string): Promise<void> => {
  await axiosInstance.delete(`/boards/${boardId}/cards/${cardId}`);
};
