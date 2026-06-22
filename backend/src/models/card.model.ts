import { Timestamp } from "@google-cloud/firestore";

export interface Card {
  id: string;
  name: string;
  description?: string;
  boardId: string;
  ownerId: string;
  listMembers?: string[];
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}
