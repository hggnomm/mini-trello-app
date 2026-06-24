import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";
import type { Board } from "@/api/board";
import { type Card, getCardsByUser } from "@/api/card";
import CardItem from "@/components/card/CardItem";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardById } from "@/api/board";
import { ROUTES } from "@/constants/route.constant";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import BaseSpinner from "@/base/baseSpinner";
import BaseButton from "@/base/baseButton";

// ─── Column ───────────────────────────────────────────────────────────────────

function Column({ title, cards }: { title: string; cards: Card[] }) {
  return (
    <div className="flex bg-[#0E0F05] w-[272px] min-w-[272px] flex-col p-2.5 max-h-[calc(100vh-200px)]">

      {/* Header */}
      <div className="mb-2 flex items-center justify-between border-b border-white/[0.06] pb-2 px-1">
        <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-gray-400">{title}</span>
        <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[12px] text-white">{cards.length || 0}</span>
      </div>

      {/* Cards list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5">
        {cards?.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

// ─── BoardView ────────────────────────────────────────────────────────────────

export default function BoardView() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.user.profile);

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!boardId) return;
    try {
      setIsLoading(true);

      const [boardData, cardsData] = await Promise.all([
        getBoardById(boardId),
        getCardsByUser(boardId, profile?.id || ""),
      ]);

      setBoard(boardData);
      setCards(cardsData);

    } catch (e: any) {
      toast.error(e.message || "Failed to load board data");
      navigate(ROUTES.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, navigate, profile?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <BaseSpinner className="!size-10" />
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="bg-[#743254] flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-200">{board.name}</h2>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto p-2 flex-1 items-start">
        <Column title="Cards" cards={cards} />

        <BaseButton variant="outline">
          <div className="flex justify-center items-center gap-2">
            <FiPlus size={13} />
            <p>Add another list</p>
          </div>
        </BaseButton>
      </div>
    </div>
  );
}
