import { Server } from "socket.io";
import http from "http";
import { logger } from "../utils/logger";
import { SOCKET_EVENTS } from "../constants/socket.constant";
import { settings } from "../utils/settings";



let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: settings.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.BOARD_JOIN, (boardId: string) => {
      socket.join(`board:${boardId}`);
      logger.info(`Client ${socket.id} joined board:${boardId}`);
    });

    socket.on(SOCKET_EVENTS.BOARD_LEAVE, (boardId: string) => {
      socket.leave(`board:${boardId}`);
      logger.info(`Client ${socket.id} left board:${boardId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
