import { useEffect, useState } from "react";
import { HiOutlineMenuAlt2, HiChevronDown } from "react-icons/hi";
import CloseButton from "@/base/baseButton/CloseButton";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import type { Task } from "@/api/task";
import { getTaskById, updateTask } from "@/api/task";
import { getCards, type Card } from "@/api/card";
import BaseModal from "@/base/baseModal";
import BaseSpinner from "@/base/baseSpinner";
import BaseSelect, { type SelectItem } from "@/base/baseSelect/BaseSelect";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import AddDescription from "@/components/task/AddDescription";

type TaskDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  cardName?: string;
  boardId: string;
  cardId: string;
  onTaskUpdated?: (updated: Task) => void;
};

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
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentCardId, setCurrentCardId] = useState(cardId);
  const [currentCardName, setCurrentCardName] = useState(cardName ?? "");
  const [cards, setCards] = useState<Card[]>([]);
  const [movingCard, setMovingCard] = useState(false);

  useEffect(() => {
    if (!isOpen || !taskProp || !boardId || !cardId) return;
    let cancelled = false;
    setLoadingTask(true);
    setCurrentCardId(cardId);
    setCurrentCardName(cardName ?? "");

    const fetchTask = async () => {
      try {
        const data = await getTaskById(boardId, cardId, taskProp.id);
        if (cancelled) return;
        setTask(data);
        setDescription(data.description ?? "");
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

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleSaveDescription = async () => {
    if (!task) return;
    setSaving(true);
    try {
      const updated = await updateTask(boardId, currentCardId, task.id, { description });
      toast.success("Description updated");
      setTask(updated);
      onTaskUpdated?.(updated);
      setIsEditingDesc(false);
    } catch {
      toast.error("Failed to update description");
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToCard = async (targetCard: Card) => {
    if (targetCard.id === currentCardId || !task) return;
    setMovingCard(true);
    try {
      const moved = await updateTask(boardId, currentCardId, task.id, { newCardId: targetCard.id });
      setCurrentCardId(targetCard.id);
      setCurrentCardName(targetCard.name);
      setTask(moved);
      toast.success(`Moved to "${targetCard.name}"`);
      onTaskUpdated?.(moved);
    } catch {
      toast.error("Failed to move task");
    } finally {
      setMovingCard(false);
    }
  };

  const ownerInitials = task?.ownerId?.slice(0, 2).toUpperCase();

  const createdDate = task?.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const cardSelectItems: SelectItem[] = cards.map((card) => ({
    id: card.id,
    label: card.name,
    onClick: () => handleMoveToCard(card),
  }));

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="!max-w-[680px]">
      {/* Top bar: card badge left, close right */}
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
        <CloseButton onClick={onClose} className="!relative !top-auto !right-auto" />
      </div>

      {loadingTask ? (
        <div className="flex items-center justify-center py-12">
          <BaseSpinner className="!size-8" />
        </div>
      ) : !task ? null : (
        <>
          <div className="mb-2">
            <h2 className="text-[40px] font-semibold text-white leading-snug">{task.title}</h2>
          </div>

          <div className="flex gap-5">
            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              {/* Members row */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <div>
                  <p className="font-semibold text-gray-500 mb-1.5 uppercase tracking-wide text-[10px]">Members</p>
                  <div className="flex items-center gap-2">
                    {ownerInitials && (
                      <div
                        title={`Owner: ${task.ownerId}`}
                        className="w-8 h-8 rounded-full bg-[#e53935] flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
                      >
                        {ownerInitials}
                      </div>
                    )}
                    {task.assignedMembers?.map((memberId) => (
                      <div
                        key={memberId}
                        title={memberId}
                        className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
                      >
                        {memberId.slice(0, 2).toUpperCase()}
                      </div>
                    ))}
                    <button
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                      title="Add member"
                    >
                      <MdOutlinePersonAddAlt size={15} />
                    </button>
                  </div>
                </div>

                {createdDate && (
                  <div>
                    <p className="font-semibold text-gray-500 mb-1.5 uppercase tracking-wide text-[10px]">Created</p>
                    <p className="text-gray-300 text-xs py-1.5">{createdDate}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineMenuAlt2 size={16} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-200">Description</h3>
                </div>

                <AddDescription
                  value={description}
                  onChange={setDescription}
                  onSave={handleSaveDescription}
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

            {/* Sidebar actions */}
            <div className="w-[160px] flex-shrink-0 flex flex-col gap-3">
              <div>
                <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wide mb-1.5">Add to card</p>
                <div className="flex flex-col gap-1">
                  <SidebarButton icon={<MdOutlinePersonAddAlt size={14} />} label="Members" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </BaseModal>
  );
}

function SidebarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-300 bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-left font-medium">
      <span className="text-gray-400">{icon}</span>
      {label}
    </button>
  );
}
