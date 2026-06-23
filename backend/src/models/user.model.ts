import { Timestamp } from "@google-cloud/firestore";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user";
  verifyCode?: number;
  codeExpiryTime?: Timestamp; 
  isVerified: boolean;
  githubId?: string;
  githubName?: string;
  githubAccessToken?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
