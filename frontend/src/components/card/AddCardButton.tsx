import { useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";
import { createCard } from "@/api/card";
import BaseButton from "@/base/baseButton";

interface AddCardButtonProps {
  boardId: string;
}

export default function AddCardButton({ boardId }: AddCardButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCard = async () => {
    if (!newCardTitle.trim() || !boardId) return;
    try {
      setIsSubmitting(true);
      await createCard(boardId, { name: newCardTitle.trim() });
      setNewCardTitle("");
      setIsAdding(false);
    } catch (e) {
      toast.error((e instanceof Error && e.message) || "Failed to create card");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdding) {
    return (
      <div className="mt-1 flex flex-col gap-2">
        <textarea
          autoFocus
          className="w-full rounded bg-white p-2 text-sm text-black placeholder-gray-500 shadow outline-none resize-none"
          placeholder="Enter a title or paste a link"
          rows={2}
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddCard();
            }
          }}
        />
        <div className="flex items-center gap-2">
          <BaseButton variant="primary" onClick={handleAddCard} disabled={isSubmitting}>
            Add card
          </BaseButton>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCardTitle("");
            }}
            className="flex items-center justify-center p-1 text-gray-400 hover:text-white"
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
      <div className="flex justify-center items-center gap-2">
        <FiPlus size={13} />
        <p>Add a card</p>
      </div>
    </BaseButton>
  );
}
