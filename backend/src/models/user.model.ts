import { Timestamp } from "@google-cloud/firestore";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user";
  verifyCode?: number;
  codeExpiryTime?: Timestamp; 
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
