import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import { FiUsers } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

import type { RootState } from "@/store";
import { useBoard } from "@/hooks/useBoard";

import AddCardButton from "@/components/card/AddCardButton";
import CardColumn from "@/components/card/CardColumn";
import InviteMemberModal from "@/components/modal/InviteMemberModal";
import GitHubRepoPickerModal from "@/components/modal/GitHubRepoPickerModal";
import BaseSpinner from "@/base/baseSpinner";
import BaseButton from "@/base/baseButton";
import BaseEditableTitle from "@/base/baseEditableTitle/BaseEditableTitle";

import { updateBoard } from "@/api/board";
import { toast } from "react-toastify";

// ─── BoardView ────────────────────────────────────────────────────────────────

export default function BoardView() {
  const { boardId } = useParams<{ boardId: string }>();
  const profile = useSelector((state: RootState) => state.user.profile);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isGithubPickerOpen, setIsGithubPickerOpen] = useState(false);

  const { board, cards, tasksMap, isLoading, handleDragEnd, handleTaskAdded, handleTaskUpdated, setBoard } = useBoard(
    boardId,
    profile?.id,
  );

  const isOwner = !!board && !!profile?.id && board.ownerId === profile.id;

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
        <div className="flex items-center gap-3 min-w-0">
          <BaseEditableTitle
            value={board.name}
            disabled={!isOwner}
            onSave={async (newTitle) => {
              if (!board || !isOwner) return false;
              try {
                const updated = await updateBoard(board.id, { name: newTitle });
                setBoard(updated.updatedBoard);
              } catch {
                toast.error("Failed to rename board");
                return false;
              }
            }}
            className="text-xl font-semibold text-gray-200 truncate px-2 py-1"
          />
          {board.githubRepository && (
            <a
              href={board.githubRepository.url}
              target="_blank"
              rel="noopener noreferrer"
              title={board.githubRepository.fullName}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-200 hover:bg-white/20 transition-colors"
            >
              <SiGithub size={12} />
              <span className="max-w-[180px] truncate">{board.githubRepository.fullName}</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <BaseButton variant="outline" onClick={() => setIsGithubPickerOpen(true)}>
              <div className="flex items-center gap-2">
                <SiGithub size={16} />
                <p>{board.githubRepository ? "Change repository" : "Link GitHub repo"}</p>
              </div>
            </BaseButton>
          )}
          <BaseButton variant="outline" onClick={() => setIsInviteModalOpen(true)}>
            <div className="flex items-center gap-2">
              <FiUsers size={16} />
              <p>Invite Member</p>
            </div>
          </BaseButton>
        </div>
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
              board={board}
              currentUserId={profile?.id}
              onTaskAdded={handleTaskAdded}
              onTaskUpdated={handleTaskUpdated}
              onBoardUpdated={(updated) => setBoard(updated)}
            />
          ))}

          <AddCardButton boardId={board.id} />
        </div>
      </DragDropContext>
      {isInviteModalOpen && (
        <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} board={board} />
      )}
      {isGithubPickerOpen && (
        <GitHubRepoPickerModal
          isOpen={isGithubPickerOpen}
          onClose={() => setIsGithubPickerOpen(false)}
          board={board}
          isOwner={isOwner}
          onLinked={(repo) => setBoard({ ...board, githubRepository: repo ?? undefined })}
        />
      )}
    </div>
  );
}
