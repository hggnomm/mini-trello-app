import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@/api/task";
import { cn } from "@/utils/cn";
import TaskDetailModal from "@/components/modal/TaskDetailModal";

interface TaskItemProps {
  task: Task;
  index: number;
  boardId: string;
  cardId: string;
  cardName?: string;
  onTaskUpdated?: (updated: Task) => void;
}

export default function TaskItem({ task, index, boardId, cardId, cardName, onTaskUpdated }: TaskItemProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              "flex cursor-pointer items-start gap-2 rounded border px-2 py-2.5 text-sm text-gray-300 transition-colors",
              {
                "bg-[#2A3038] border-blue-500/50 shadow-xl z-50": snapshot.isDragging,
                "bg-[#1E2329] border-white/5 hover:border-white/10": !snapshot.isDragging,
              },
            )}
            style={provided.draggableProps.style}
            onClick={(e) => {
              if (snapshot.isDragging) return;
              e.stopPropagation();
              setIsDetailOpen(true);
            }}
          >
            <span className="flex-1 break-words leading-snug">{task.title}</span>
          </div>
        )}
      </Draggable>

      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={task}
        cardName={cardName}
        boardId={boardId}
        cardId={cardId}
        onTaskUpdated={(updated) => {
          onTaskUpdated?.(updated);
        }}
      />
    </>
  );
}
