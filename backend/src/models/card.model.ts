import { Timestamp } from "@google-cloud/firestore";

export interface Card {
  id: string;
  name: string;
  description?: string;
  boardId: string;
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
