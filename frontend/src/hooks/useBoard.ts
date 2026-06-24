import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { DropResult } from "@hello-pangea/dnd";

import { type Board, getBoardById } from "@/api/board";
import { type Card, getCardsByUser } from "@/api/card";
import { type Task, getBoardTasks, reorderTasks } from "@/api/task";
import { ROUTES } from "@/constants/route.constant";
import { SOCKET_EVENTS } from "@/constants/socket.constant";
import { useBoardSocket } from "@/hooks/useBoardSocket";

export function useBoard(boardId: string | undefined, profileId: string | undefined) {
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [tasksMap, setTasksMap] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch board + cards + tasks ────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!boardId || !profileId) return;

    try {
      setIsLoading(true);

      const [boardData, cardsData, tasksData] = await Promise.all([
        getBoardById(boardId),
        getCardsByUser(boardId, profileId),
        getBoardTasks(boardId),
      ]);

      setBoard(boardData);
      setCards(cardsData);

      const groupedTasks = cardsData.reduce(
        (acc, card) => {
          acc[card.id] = tasksData
            .filter((t) => t.cardId === card.id)
            .sort((a, b) => a.order - b.order);

          return acc;
        },
        {} as Record<string, Task[]>,
      );

      setTasksMap(groupedTasks);
    } catch (e) {
      toast.error((e instanceof Error && e.message) || "Failed to load board data");
      navigate(ROUTES.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, profileId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Socket: listen for new cards/tasks ─────────────────────────────────────
  useBoardSocket(boardId, {
    [SOCKET_EVENTS.CARD_CREATED]: (newCard: Card) => {
      setCards((prev) => {
        if (prev.some((c) => c.id === newCard.id)) {
          return prev;
        }

        return [...prev, newCard];
      });

      setTasksMap((prev) => ({
        ...prev,
        [newCard.id]: prev[newCard.id] || [],
      }));
    },

    [SOCKET_EVENTS.TASK_CREATED]: (newTask: Task) => {
      setTasksMap((prev) => {
        const list = prev[newTask.cardId] || [];

        if (list.some((t) => t.id === newTask.id)) {
          return prev;
        }

        return {
          ...prev,
          [newTask.cardId]: [...list, newTask],
        };
      });
    },

    [SOCKET_EVENTS.TASK_UPDATED]: () => {
      if (!boardId) return;

      getBoardTasks(boardId).then((tasksData) => {
        setCards((prevCards) => {
          const groupedTasks = prevCards.reduce(
            (acc, card) => {
              acc[card.id] = tasksData
                .filter((t) => t.cardId === card.id)
                .sort((a, b) => a.order - b.order);

              return acc;
            },
            {} as Record<string, Task[]>,
          );

          setTasksMap(groupedTasks);

          return prevCards;
        });
      });
    },
  });

  // ── Drag and Drop Logic ────────────────────────────────────────────────────
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCardId = source.droppableId;
    const destCardId = destination.droppableId;

    const sourceTasks = Array.from(tasksMap[sourceCardId] || []);
    const destTasks =
      sourceCardId === destCardId
        ? sourceTasks
        : Array.from(tasksMap[destCardId] || []);

    const [movedTask] = sourceTasks.splice(source.index, 1);

    movedTask.cardId = destCardId;

    destTasks.splice(destination.index, 0, movedTask);

    // Update order optimistically
    destTasks.forEach((task, index) => {
      task.order = index + 1;
    });

    if (sourceCardId !== destCardId) {
      sourceTasks.forEach((task, index) => {
        task.order = index + 1;
      });
    }

    setTasksMap((prev) => ({
      ...prev,
      [sourceCardId]: sourceTasks,
      [destCardId]: destTasks,
    }));

    try {
      const updatedTasks =
        sourceCardId === destCardId
          ? destTasks
          : [...destTasks, ...sourceTasks];

      const payload = updatedTasks.map((t) => ({
        id: t.id,
        cardId: t.cardId,
        order: t.order,
      }));

      await reorderTasks(boardId!, payload);
    } catch (e) {
      console.log(e instanceof Error && e.message);
      fetchData(); // revert
    }
  };

  const handleTaskAdded = (task: Task) => {
    setTasksMap((prev) => {
      const list = prev[task.cardId] || [];

      if (list.some((t) => t.id === task.id)) {
        return prev;
      }

      return {
        ...prev,
        [task.cardId]: [...list, task],
      };
    });
  };

  return {
    board,
    cards,
    tasksMap,
    isLoading,
    handleDragEnd,
    handleTaskAdded,
  };
}