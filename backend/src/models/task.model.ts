import { Timestamp } from "@google-cloud/firestore";

export interface Task {
  id: string;
  cardId: string;
  boardId: string;
  ownerId: string;
  title: string;
  description: string;
  status: string; // name Card
  assignedMembers: string[];
  githubAttachments?: any[];
  order: number;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}
