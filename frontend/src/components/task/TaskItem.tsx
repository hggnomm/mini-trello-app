import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@/api/task";
import { cn } from "@/utils/cn";

interface TaskItemProps {
  task: Task;
  index: number;
}

export default function TaskItem({ task, index }: TaskItemProps) {
  return (
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
        >
          <span className="flex-1 break-words leading-snug">{task.title}</span>
        </div>
      )}
    </Draggable>
  );
}
