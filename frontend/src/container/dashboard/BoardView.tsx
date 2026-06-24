import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import { FiUsers } from "react-icons/fi";

import type { RootState } from "@/store";
import { useBoard } from "@/hooks/useBoard";

import AddCardButton from "@/components/card/AddCardButton";
import CardColumn from "@/components/card/CardColumn";
import InviteMemberModal from "@/components/modal/InviteMemberModal";
import BaseSpinner from "@/base/baseSpinner";
import BaseButton from "@/base/baseButton";

// ─── BoardView ────────────────────────────────────────────────────────────────

export default function BoardView() {
  const { boardId } = useParams<{ boardId: string }>();
  const profile = useSelector((state: RootState) => state.user.profile);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { board, cards, tasksMap, isLoading, handleDragEnd, handleTaskAdded } = useBoard(boardId, profile?.id);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <BaseSpinner className="!size-10" />
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="bg-[#743254] flex items-center justify-between px-4 py-3 shrink-0">
        <h2 className="text-xl font-semibold text-gray-200">{board.name}</h2>
        <BaseButton variant="outline" onClick={() => setIsInviteModalOpen(true)}>
          <div className="flex items-center gap-2">
            <FiUsers size={16} />
            <p>Invite Member</p>
          </div>
        </BaseButton>
      </div>
      
      {/* https://medium.com/codex/how-to-implement-a-simple-drag-and-drop-using-create-react-app-and-react-beautiful-dnd-4e6e57a2299f */}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 bg-slate-200 overflow-x-auto p-3 flex-1 items-start">
          {cards?.map((card) => (
            <CardColumn
              key={card.id}
              boardId={board.id}
              card={card}
              tasks={tasksMap[card.id] || []}
              onTaskAdded={handleTaskAdded}
            />
          ))}

          <AddCardButton boardId={board.id} />
        </div>
      </DragDropContext>
      {isInviteModalOpen && (
        <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} board={board} />
      )}
    </div>
  );
}
