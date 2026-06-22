import "./utils/settings";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { checkConnection, getDb } from "./libs/firebase/firebase";
import { getGithubConnection } from "./libs/github/github";

import boardRoutes from "./routes/board.route";
import authRoutes from "./routes/auth.route";
import cardRoutes from "./routes/card.route";
import taskRoutes from "./routes/task.route";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/boards", boardRoutes);
  app.use("/boards", cardRoutes);
  app.use("/boards", taskRoutes);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello, World!");
  });

  app.get("/health", async (req: Request, res: Response) => {
    const db = await checkConnection();
    const github = await getGithubConnection();
    try {
      res.status(200).json({
        status: "up",
        db: db,
        github: github.login ?? "Not connected",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", db: "Error connect to Firestore" });
    }
  });

  return app;
}
