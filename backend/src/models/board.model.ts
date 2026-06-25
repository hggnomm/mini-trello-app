import { Timestamp } from "@google-cloud/firestore";

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
  listMembers?: {
    [userId: string]: "accepted" | "pending" | "declined";
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
