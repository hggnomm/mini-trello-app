import { useState } from "react";
import { toast } from "react-toastify";
import { HiX } from "react-icons/hi";
import { createBoard } from "../../api/board";
import BaseButton from "../../base/baseButton";
import BaseModal from "../../base/baseModal";

type CreateBoardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateBoardModal({ isOpen, onClose }: CreateBoardModalProps) {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) {
      toast.error("Board name is required");
      return;
    }
    try {
      await createBoard({ name: boardName, description: boardDescription });
      toast.success("Board created successfully!");
      setBoardName("");
      setBoardDescription("");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create board");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <HiX size={20} />
      </button>

      <h3 className="text-lg font-bold text-white mb-4">Create New Board</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1 block">
            Board Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Enter board title"
            className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-[8px] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1 block">Description</label>
          <textarea
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
            placeholder="Enter board description (optional)"
            rows={3}
            className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-[8px] text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <BaseButton variant="secondary" onClick={onClose}>
            Cancel
          </BaseButton>
          <BaseButton variant="primary" type="submit">
            Create
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  );
}
