import { Request } from "express";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: "admin" | "user";
}

export const getAuthenticatedUser = (req: Request): AuthenticatedUser => {
  const user = (req as any).user;
  if (!user) {
    throw new Error("User is not authenticated");
  }
  return user;
};
