import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Board } from "@/api/board";
import { type Card, getCardsByUser } from "@/api/card";
import AddCardButton from "@/components/card/AddCardButton";

import CardColumn from "@/components/card/CardColumn";

import { useParams, useNavigate } from "react-router-dom";
import { getBoardById } from "@/api/board";
import { ROUTES } from "@/constants/route.constant";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import BaseSpinner from "@/base/baseSpinner";
import { socket } from "@/utils/socket";
import { SOCKET_EVENTS } from "@/constants/socket.constant";

// ─── BoardView ────────────────────────────────────────────────────────────────

export default function BoardView() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.user.profile);

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // ── Socket: join room, listen for new cards ────────────────────────────────
  useEffect(() => {
    if (!boardId) return;

    const handleCardCreated = (newCard: Card) => {
      setCards((prev) => {
        if (prev.some((c) => c.id === newCard.id)) return prev;
        return [...prev, newCard];
      });
    };

    const handleConnect = () => {
      socket.emit(SOCKET_EVENTS.BOARD_JOIN, boardId);
    };

    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.BOARD_JOIN, boardId);
    } else {
      socket.once("connect", handleConnect);
    }

    socket.on(SOCKET_EVENTS.CARD_CREATED, handleCardCreated);
    socket.connect();

    return () => {
      socket.emit(SOCKET_EVENTS.BOARD_LEAVE, boardId);
      socket.off("connect", handleConnect);
      socket.off(SOCKET_EVENTS.CARD_CREATED, handleCardCreated);
      socket.disconnect();
    };
  }, [boardId]);

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
      </div>

      <div className="flex gap-3 overflow-x-auto p-3 flex-1 items-start">
        {cards?.map((card) => (
          <CardColumn key={card.id} boardId={board.id} card={card} />
        ))}

        <AddCardButton boardId={board.id} />
      </div>
    </div>
  );
}
