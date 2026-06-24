import { Droppable } from "@hello-pangea/dnd";
import { type Card } from "@/api/card";
import { type Task } from "@/api/task";
import AddTaskButton from "@/components/task/AddTaskButton";
import TaskItem from "@/components/task/TaskItem";
import { cn } from "@/utils/cn";

interface CardColumnProps {
  boardId: string;
  card: Card;
  tasks: Task[];
  onTaskAdded?: (task: Task) => void;
}

export default function CardColumn({ boardId, card, tasks, onTaskAdded }: CardColumnProps) {
  return (
    <div className="flex w-[272px] min-w-[272px] max-h-[calc(100vh-140px)] flex-col rounded-md bg-[#0E0F05] p-2.5">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 px-1 pb-2">
        <span className="flex-1 break-words text-[0.8rem] font-semibold text-gray-200">{card.name}</span>

        <span className="ml-2 shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={card.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn("min-h-5 mb-2 flex flex-1 flex-col gap-1.5 overflow-y-auto rounded pr-0.5 transition-colors", {
              "bg-white/5": snapshot.isDraggingOver,
            })}
          >
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}

            {provided.placeholder}

            <AddTaskButton boardId={boardId} cardId={card.id} onTaskAdded={onTaskAdded} />
          </div>
        )}
      </Droppable>
    </div>
  );
}
