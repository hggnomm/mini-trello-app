import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Board } from "@/api/board";
import { type Card, getCardsByUser } from "@/api/card";
import AddCardButton from "@/components/card/AddCardButton";
import InviteMemberModal from "@/components/modal/InviteMemberModal";

import CardColumn from "@/components/card/CardColumn";

import { useParams, useNavigate } from "react-router-dom";
import { getBoardById } from "@/api/board";
import { ROUTES } from "@/constants/route.constant";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import BaseSpinner from "@/base/baseSpinner";
import { SOCKET_EVENTS } from "@/constants/socket.constant";
import { useBoardSocket } from "@/hooks/useBoardSocket";
import BaseButton from "@/base/baseButton";
import { FiUsers } from "react-icons/fi";

// ─── BoardView ────────────────────────────────────────────────────────────────

export default function BoardView() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.user.profile);

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // ── Fetch board + cards ────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!boardId || !profile?.id) return;
    try {
      setIsLoading(true);
      const [boardData, cardsData] = await Promise.all([getBoardById(boardId), getCardsByUser(boardId, profile.id)]);
      setBoard(boardData);
      setCards(cardsData);
    } catch (e) {
      toast.error((e instanceof Error && e.message) || "Failed to load board data");
      navigate(ROUTES.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, profile?.id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Socket: listen for new cards ───────────────────────────────────────────
  useBoardSocket(boardId, {
    [SOCKET_EVENTS.CARD_CREATED]: (newCard: Card) => {
      setCards((prev) => {
        if (prev.some((c) => c.id === newCard.id)) return prev;
        return [...prev, newCard];
      });
    },
  });

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

      <div className="flex gap-3 overflow-x-auto p-3 flex-1 items-start">
        {cards?.map((card) => (
          <CardColumn key={card.id} boardId={board.id} card={card} />
        ))}

        <AddCardButton boardId={board.id} />
      </div>

      {isInviteModalOpen && (
        <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} board={board} />
      )}
    </div>
  );
}
