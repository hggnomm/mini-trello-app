import { useEffect, useState } from "react";

import { type Card } from "@/api/card";
import { type Task, getTasks } from "@/api/task";
import AddTaskButton from "@/components/task/AddTaskButton";
import { toast } from "react-toastify";

interface CardColumnProps {
  boardId: string;
  card: Card;
}

export default function CardColumn({ boardId, card }: CardColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!boardId || !card.id) return;

    let cancelled = false;

    getTasks(boardId, card.id)
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((e) => {
        toast.error((e instanceof Error && e.message) || "Failed to load tasks");
      });

    return () => {
      cancelled = true;
    };
  }, [boardId, card.id]);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prev) => (prev.some((task) => task.id === newTask.id) ? prev : [...prev, newTask]));
  };

  return (
    <div className="flex w-[272px] min-w-[272px] max-h-[calc(100vh-140px)] flex-col rounded-md bg-[#0E0F05] p-2.5">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 px-1 pb-2">
        <span className="flex-1 break-words text-[0.8rem] font-semibold text-gray-200">{card.name}</span>

        <span className="ml-2 shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">
          {tasks.length}
        </span>
      </div>

      <div className="mb-2 flex flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex cursor-pointer items-start gap-2 rounded border border-white/5 bg-[#1E2329] px-2 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/10"
          >
            <span className="flex-1 break-words leading-snug">{task.title}</span>
          </div>
        ))}

        <AddTaskButton boardId={boardId} cardId={card.id} onTaskAdded={handleTaskAdded} />
      </div>
    </div>
  );
}
