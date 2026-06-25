import { useEffect, useState } from "react";
import { HiOutlineMenuAlt2, HiChevronDown, HiCheck, HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import type { Task } from "@/api/task";
import { getTaskById, updateTask, assignMemberToTask, removeMemberFromTask, deleteTask } from "@/api/task";
import { getBoardMembers, type BoardMember } from "@/api/board";
import { getCards, type Card } from "@/api/card";
import BaseModal from "@/base/baseModal";
import BaseSpinner from "@/base/baseSpinner";
import BaseSelect, { type SelectItem } from "@/base/baseSelect/BaseSelect";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import AddDescription from "@/components/task/AddDescription";
import TaskAssignedMembers from "../task/TaskAssignedMembers";

type TaskDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  cardName?: string;
  boardId: string;
  cardId: string;
  onTaskUpdated?: (updated: Task) => void;
};

function SidebarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-300 bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-left font-medium cursor-pointer">
      <span className="text-gray-400">{icon}</span>
      {label}
    </div>
  );
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task: taskProp,
  cardName,
  boardId,
  cardId,
  onTaskUpdated,
}: TaskDetailModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentCardId, setCurrentCardId] = useState(cardId);
  const [currentCardName, setCurrentCardName] = useState(cardName ?? "");
  const [cards, setCards] = useState<Card[]>([]);
  const [movingCard, setMovingCard] = useState(false);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteTask = async () => {
    if (!task) return;

    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteTask(boardId, currentCardId, task.id);
      toast.success("Task deleted");
      onClose();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !taskProp || !boardId || !cardId) return;
    let cancelled = false;
    setLoadingTask(true);
    setCurrentCardId(cardId);
    setCurrentCardName(cardName ?? "");

    const fetchTask = async () => {
      try {
        const [taskData, membersData] = await Promise.all([
          getTaskById(boardId, cardId, taskProp.id),
          getBoardMembers(boardId),
        ]);

        if (cancelled) return;

        setTask(taskData);
        setDescription(taskData.description ?? "");
        setTitle(taskData.title ?? "");
        setBoardMembers(membersData);
      } catch {
        if (!cancelled) toast.error("Failed to load task details");
      } finally {
        if (!cancelled) setLoadingTask(false);
      }
    };

    fetchTask();
    return () => {
      cancelled = true;
    };
  }, [isOpen, taskProp?.id, boardId, cardId]);

  useEffect(() => {
    if (isOpen) return;

    const timer = setTimeout(() => {
      setTask(null);
      setIsEditingDesc(false);
      setCards([]);
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleCardPickerOpen = async () => {
    if (cards.length > 0) return;
    try {
      const data = await getCards(boardId);
      setCards(data);
    } catch {
      toast.error("Failed to load lists");
    }
  };

  const handleMemberPickerOpen = async () => {
    if (boardMembers.length > 0) return;
    try {
      const data = await getBoardMembers(boardId);
      setBoardMembers(data);
    } catch {
      toast.error("Failed to load board members");
    }
  };

  const handleToggleMember = async (memberId: string) => {
    if (!task) return;
    const isAssigned = task.assignedMembers?.includes(memberId);

    try {
      if (isAssigned) {
        await removeMemberFromTask(boardId, currentCardId, task.id, memberId);

        const newMembers = task.assignedMembers.filter((m) => m !== memberId);
        const mergedTask = { ...task, assignedMembers: newMembers };

        setTask(mergedTask);
        onTaskUpdated?.(mergedTask);
        toast.success("Member removed");
      } else {
        await assignMemberToTask(boardId, currentCardId, task.id, memberId);

        const newMembers = [...(task.assignedMembers || []), memberId];
        const mergedTask = { ...task, assignedMembers: newMembers };

        setTask(mergedTask);
        onTaskUpdated?.(mergedTask);
        toast.success("Member assigned");
      }
    } catch {
      toast.error(`Failed to ${isAssigned ? "remove" : "assign"} member`);
    }
  };

  const handleSaveTask = async (updates: Partial<Task>, successMsg: string, errorMsg: string) => {
    if (!task) return false;
    setSaving(true);
    try {
      const updated = await updateTask(boardId, currentCardId, task.id, { ...updates });

      toast.success(successMsg);
      const mergedTask = { ...task, ...updated };

      setTask(mergedTask);
      onTaskUpdated?.(mergedTask);
      return true;
    } catch {
      toast.error(errorMsg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToCard = async (targetCard: Card) => {
    if (targetCard.id === currentCardId || !task) return;

    setMovingCard(true);

    const success = await handleSaveTask(
      { newCardId: targetCard.id },
      `Moved to "${targetCard.name}"`,
      "Failed to move task",
    );

    if (success) {
      setCurrentCardId(targetCard.id);
      setCurrentCardName(targetCard.name);
    }
    setMovingCard(false);
  };

  const cardSelectItems: SelectItem[] = cards.map((card) => ({
    id: card.id,
    label: card.name,
    onClick: () => handleMoveToCard(card),
  }));

  const memberSelectItems: SelectItem[] = boardMembers.map((m) => {
    const isAssigned = task?.assignedMembers?.includes(m.id);
    return {
      id: m.id,
      label: m.name,
      icon: isAssigned ? <HiCheck /> : undefined,
      onClick: () => handleToggleMember(m.id),
    };
  });

  const taskMenuItems: SelectItem[] = [
    {
      id: "delete",
      label: deleting ? "Deleting..." : "Delete task",
      onClick: handleDeleteTask,
    },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="!max-w-[800px]" overlayClassName="!items-start !pt-[4rem]">
      <div className="flex items-center justify-between mb-4">
        <BaseSelect
          selectedId={currentCardId}
          items={cardSelectItems}
          trigger={
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border",
                "bg-white/[0.07] border-white/10 text-gray-300 hover:bg-white/[0.12] hover:text-white",
                movingCard && "opacity-50 pointer-events-none",
              )}
            >
              {currentCardName || "—"}
              <HiChevronDown size={11} />
            </span>
          }
          triggerClassName="!w-auto !h-auto !bg-transparent !p-0 !rounded-none"
          dropdownClassName="!bg-[#1e2329] !border-white/10 !shadow-2xl !min-w-[200px]"
          onOpen={handleCardPickerOpen}
        />
        <BaseSelect
          items={taskMenuItems}
          trigger={
            <button
              type="button"
              className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white/[0.07] border border-white/10 text-gray-300 hover:bg-white/[0.12] hover:text-white transition-colors"
            >
              <HiOutlineDotsHorizontal size={16} />
            </button>
          }
          triggerClassName="!w-auto !h-auto !bg-transparent !p-0 !rounded-none"
          dropdownClassName="!bg-[#1e2329] !border-white/10 !shadow-2xl !min-w-[200px]"
        />
      </div>

      {loadingTask && (
        <div className="flex items-center justify-center py-12">
          <BaseSpinner className="!size-8" />
        </div>
      )}

      {!loadingTask && task && (
        <>
          <div id="title-task" className="mb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={async () => {
                if (!task) return;
                const trimmedTitle = title.trim();
                if (!trimmedTitle) {
                  setTitle(task.title);
                  return;
                }
                if (trimmedTitle === task.title) return;
                const success = await handleSaveTask(
                  { title: trimmedTitle },
                  "Title updated",
                  "Failed to update title",
                );
                if (!success) setTitle(task.title);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="w-full bg-transparent text-[40px] font-semibold text-white leading-snug px-2 py-1 rounded border border-transparent focus:border-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex gap-5">
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <TaskAssignedMembers
                task={task}
                boardMembers={boardMembers}
                memberSelectItems={memberSelectItems}
                onToggleMember={handleToggleMember}
                onMemberPickerOpen={handleMemberPickerOpen}
              />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineMenuAlt2 size={16} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-200">Description</h3>
                </div>

                <AddDescription
                  value={description}
                  onChange={setDescription}
                  onSave={async () => {
                    const success = await handleSaveTask(
                      { description },
                      "Description updated",
                      "Failed to update description",
                    );
                    if (success) setIsEditingDesc(false);
                  }}
                  onCancel={() => {
                    setDescription(task.description ?? "");
                    setIsEditingDesc(false);
                  }}
                  isEditing={isEditingDesc}
                  onStartEdit={() => setIsEditingDesc(true)}
                  saving={saving}
                />
              </div>
            </div>

            <div className="w-[160px] flex-shrink-0 flex flex-col gap-3">
              <div>
                <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wide mb-1.5">Assign members</p>
                <div className="flex flex-col gap-1">
                  <BaseSelect
                    items={memberSelectItems}
                    onOpen={handleMemberPickerOpen}
                    trigger={<SidebarButton icon={<MdOutlinePersonAddAlt size={14} />} label="Members" />}
                    triggerClassName="!w-full !h-auto !bg-transparent !p-0 !rounded-none"
                    dropdownClassName="!bg-[#1e2329] !border-white/10 !shadow-2xl !min-w-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </BaseModal>
  );
}
