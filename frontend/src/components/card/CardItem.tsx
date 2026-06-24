import { useEffect, useState } from "react";
import { type Card } from "@/api/card";
import { type Task, getTasks } from "@/api/task";
import AddTaskButton from "@/components/task/AddTaskButton";

interface CardItemProps {
  card: Card;
  boardId: string;
}

export default function CardItem({ card, boardId }: CardItemProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!boardId || !card.id) return;

    let cancelled = false;

    getTasks(boardId, card.id)
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch(() => {
        // Tasks are non-critical, ignore errors.
      });

    return () => {
      cancelled = true;
    };
  }, [boardId, card.id]);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prev) => {
      if (prev.some((t) => t.id === newTask.id)) return prev;
      return [...prev, newTask];
    });
  };

  return (
    <div className="group flex flex-col gap-1 rounded-md bg-[#1e2329] border border-white/5 px-2.5 py-2 hover:border-white/10 transition-colors cursor-pointer">
      <span className="text-[0.8rem] text-gray-300 leading-snug break-words">{card.name}</span>

      {tasks.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 rounded px-1.5 py-1 text-xs text-gray-400 bg-white/[0.04] hover:bg-white/[0.07]"
            >
              <span className="size-1.5 rounded-full bg-gray-600 flex-shrink-0" />
              <span className="flex-1 leading-snug break-words">{task.title}</span>
            </li>
          ))}
        </ul>
      )}

      <AddTaskButton boardId={boardId} cardId={card.id} onTaskAdded={handleTaskAdded} />
    </div>
  );
}
