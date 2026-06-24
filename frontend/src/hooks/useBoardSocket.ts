import { useEffect } from "react";
import type { Card } from "@/api/card";
import type { Task } from "@/api/task";
import { SOCKET_EVENTS } from "@/constants/socket.constant";
import { socket } from "@/utils/socket";

type BoardSocketEventHandlers = {
  [SOCKET_EVENTS.CARD_CREATED]?: (card: Card) => void;
  [SOCKET_EVENTS.TASK_CREATED]?: (task: Task) => void;
  [SOCKET_EVENTS.TASK_UPDATED]?: (payload: { id: string; cardId: string }) => void;
};

type SocketListener = (...args: unknown[]) => void;

export function useBoardSocket(boardId: string | undefined, handlers: BoardSocketEventHandlers) {
  useEffect(() => {
    if (!boardId) return;

    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.BOARD_JOIN, boardId);

    const entries = Object.entries(handlers).filter(
      (entry): entry is [keyof BoardSocketEventHandlers, SocketListener] => typeof entry[1] === "function",
    );

    for (const [event, handler] of entries) {
      socket.on(event, handler);
    }

    return () => {
      socket.emit(SOCKET_EVENTS.BOARD_LEAVE, boardId);

      for (const [event, handler] of entries) {
        socket.off(event, handler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);
}
