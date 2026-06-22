import { Timestamp } from "@google-cloud/firestore";

export interface Board {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  githubRepositoryId?: string;
  listMembers?: {
    [userId: string]: "accepted" | "pending" | "declined";
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
