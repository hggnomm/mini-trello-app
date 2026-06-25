import { useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";
import { createTask, type Task } from "@/api/task";
import BaseButton from "@/base/baseButton";

interface AddTaskButtonProps {
  boardId: string;
  cardId: string;
  onTaskAdded?: (task: Task) => void;
}

export default function AddTaskButton({ boardId, cardId, onTaskAdded }: AddTaskButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      setIsSubmitting(true);
      const newTask = await createTask(boardId, cardId, { title: taskTitle.trim() });
      onTaskAdded?.(newTask);
      setTaskTitle("");
      setIsAdding(false);
    } catch (e) {
      toast.error((e instanceof Error && e.message) || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdding) {
    return (
      <div className="flex flex-col gap-2 bg-[#A16081]/20 border border-[#A16081]/40 rounded-md p-2.5">
        <input
          autoFocus
          type="text"
          className="w-full rounded bg-white p-2 text-sm text-black placeholder-gray-500 shadow outline-none"
          placeholder="Enter task title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
            if (e.key === "Escape") {
              setIsAdding(false);
              setTaskTitle("");
            }
          }}
        />
        <div className="flex items-center gap-3">
          <BaseButton variant="secondary" onClick={handleAddTask} disabled={isSubmitting}>
            Add task
          </BaseButton>
          <button
            onClick={() => {
              setIsAdding(false);
              setTaskTitle("");
            }}
            className="flex items-center justify-center p-1 text-[#A16081] hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <BaseButton
      variant="ghost"
      onClick={() => setIsAdding(true)}
      className="w-full justify-start px-2 text-white hover:bg-white/[0.09]"
    >
      <div className="flex items-center gap-2">
        <FiPlus size={13} />
        <p>Add a task</p>
      </div>
    </BaseButton>
  );
}
