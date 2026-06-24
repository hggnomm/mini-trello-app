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

function buildTaskMap(cards: Card[], tasks: Task[]): Record<string, Task[]> {
  const taskMap: Record<string, Task[]> = {};

  for (const card of cards) {
    const tasksInCard = tasks
      .filter((task) => task.cardId === card.id)
      .sort((firstTask, secondTask) => firstTask.order - secondTask.order);

    taskMap[card.id] = tasksInCard;
  }

  return taskMap;
}

export function useBoard(boardId: string | undefined, profileId: string | undefined) {
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [tasksMap, setTasksMap] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!boardId || !profileId) {
      return;
    }

    try {
      setIsLoading(true);

      const [boardData, cardsData, tasksData] = await Promise.all([
        getBoardById(boardId),
        getCardsByUser(boardId, profileId),
        getBoardTasks(boardId),
      ]);

      setBoard(boardData);
      setCards(cardsData);
      setTasksMap(buildTaskMap(cardsData, tasksData));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load board data");
      navigate(ROUTES.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, profileId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useBoardSocket(boardId, {
    [SOCKET_EVENTS.CARD_CREATED]: (newCard: Card) => {
      setCards((currentCards) => {
        const cardExists = currentCards.some((card) => card.id === newCard.id);

        if (cardExists) {
          return currentCards;
        }

        return [...currentCards, newCard];
      });

      setTasksMap((currentTaskMap) => {
        return {
          ...currentTaskMap,
          [newCard.id]: currentTaskMap[newCard.id] ?? [],
        };
      });
    },

    [SOCKET_EVENTS.TASK_CREATED]: (newTask: Task) => {
      setTasksMap((currentTaskMap) => {
        const currentTasks = currentTaskMap[newTask.cardId] ?? [];

        const taskExists = currentTasks.some((task) => task.id === newTask.id);

        if (taskExists) {
          return currentTaskMap;
        }

        return {
          ...currentTaskMap,
          [newTask.cardId]: [...currentTasks, newTask],
        };
      });
    },

    [SOCKET_EVENTS.TASK_UPDATED]: async () => {
      if (!boardId) {
        return;
      }

      try {
        const tasksData = await getBoardTasks(boardId);

        setTasksMap(() => {
          return buildTaskMap(cards, tasksData);
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const isSamePosition = source.droppableId === destination.droppableId && source.index === destination.index;

    if (isSamePosition) {
      return;
    }

    const sourceCardId = source.droppableId;
    const destinationCardId = destination.droppableId;

    const sourceTaskList = [...(tasksMap[sourceCardId] ?? [])];

    const destinationTaskList =
      sourceCardId === destinationCardId ? sourceTaskList : [...(tasksMap[destinationCardId] ?? [])];

    const [movedTask] = sourceTaskList.splice(source.index, 1);

    if (!movedTask) {
      return;
    }

    movedTask.cardId = destinationCardId;

    destinationTaskList.splice(destination.index, 0, movedTask);

    destinationTaskList.forEach((task, index) => {
      task.order = index + 1;
    });

    if (sourceCardId !== destinationCardId) {
      sourceTaskList.forEach((task, index) => {
        task.order = index + 1;
      });
    }

    setTasksMap((currentTaskMap) => {
      return {
        ...currentTaskMap,
        [sourceCardId]: sourceTaskList,
        [destinationCardId]: destinationTaskList,
      };
    });

    try {
      const updatedTasks =
        sourceCardId === destinationCardId ? destinationTaskList : [...destinationTaskList, ...sourceTaskList];

      const payload = updatedTasks.map((task) => ({
        id: task.id,
        cardId: task.cardId,
        order: task.order,
      }));

      await reorderTasks(boardId!, payload);
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const handleTaskAdded = (task: Task) => {
    setTasksMap((currentTaskMap) => {
      const currentTasks = currentTaskMap[task.cardId] ?? [];

      const taskExists = currentTasks.some((currentTask) => currentTask.id === task.id);

      if (taskExists) {
        return currentTaskMap;
      }

      return {
        ...currentTaskMap,
        [task.cardId]: [...currentTasks, task],
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
