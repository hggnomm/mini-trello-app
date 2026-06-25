import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import { FiUsers } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import type { RootState } from "@/store";
import { useBoard } from "@/hooks/useBoard";

import AddCardButton from "@/components/card/AddCardButton";
import CardColumn from "@/components/card/CardColumn";
import InviteMemberModal from "@/components/modal/InviteMemberModal";
import GitHubRepoPickerModal from "@/components/modal/GitHubRepoPickerModal";
import BaseSpinner from "@/base/baseSpinner";
import BaseButton from "@/base/baseButton";
import BaseSelect from "@/base/baseSelect/BaseSelect";
import BaseEditableTitle from "@/base/baseEditableTitle/BaseEditableTitle";
import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";

import { updateBoard, deleteBoard } from "@/api/board";
import { toast } from "react-toastify";

// ─── BoardView ────────────────────────────────────────────────────────────────

export default function BoardView() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.user.profile);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isGithubPickerOpen, setIsGithubPickerOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { board, cards, tasksMap, isLoading, handleDragEnd, handleTaskAdded, handleTaskUpdated, setBoard } = useBoard(
    boardId,
    profile?.id,
  );

  const isOwner = !!board && !!profile?.id && board.ownerId === profile.id;

  const handleDeleteBoard = async () => {
    if (!board) return;
    try {
      setDeleting(true);
      await deleteBoard(board.id);
      toast.success("Board deleted successfully");
      setIsConfirmDeleteOpen(false);
      navigate("/");
    } catch {
      toast.error("Failed to delete board");
    } finally {
      setDeleting(false);
    }
  };

  const boardMenuItems = [
    {
      id: "delete",
      label: deleting ? "Deleting..." : "Delete board",
      onClick: () => setIsConfirmDeleteOpen(true),
    },
  ];

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
          {isOwner && (
            <BaseSelect
              items={boardMenuItems}
              align="right"
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
          )}
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
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteBoard}
        title="Delete Board"
        message="Are you sure you want to delete this board? All lists and tasks will be permanently removed. This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
