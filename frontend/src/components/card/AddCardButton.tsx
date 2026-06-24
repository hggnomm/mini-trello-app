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
  const [cardName, setCardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleAddCard = async () => {
    if (!cardName.trim() || !boardId) return;

    try {
      setIsCreating(true);
      
      await createCard(boardId, { name: cardName.trim() });

      setCardName("");
      setIsAdding(false);
    } catch (e) {
      toast.error((e instanceof Error && e.message) || "Failed to create card");
    } finally {
      setIsCreating(false);
    }
  };

  if (isAdding) {
    return (
      <div className="w-[272px] min-w-[272px] flex flex-col gap-2 bg-[#A16081]/20 border border-[#A16081]/40 rounded-md p-2.5">
        <input
          autoFocus
          type="text"
          className="w-full rounded bg-white p-2 text-sm text-black placeholder-gray-500 shadow outline-none"
          placeholder="Enter card name..."
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddCard();
            if (e.key === "Escape") {
              setIsAdding(false);
              setCardName("");
            }
          }}
        />
        <div className="flex items-center gap-2">
          <BaseButton variant="primary" onClick={handleAddCard} disabled={isCreating}>
            Add card
          </BaseButton>
          <button
            onClick={() => {
              setIsAdding(false);
              setCardName("");
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
      variant="secondary"
      onClick={() => setIsAdding(true)}
      className="w-[272px] bg-[#A16081] rounded-md hover:bg-[#9e5579] min-w-[272px] justify-start active:scale-[0.99]"
    >
      <div className="flex justify-center items-center gap-2">
        <FiPlus size={13} />
        <p>Add another card</p>
      </div>
    </BaseButton>
  );
}
