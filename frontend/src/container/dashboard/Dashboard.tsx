import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getBoards, type Board } from "@/api/board";
import { ROUTES } from "@/constants/route.constant";

const CreateBoardModal = lazy(() => import("@/components/modal/CreateBoardModal"));

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load boards");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleBoardClick = (board: Board) => {
    navigate(ROUTES.BOARD_DETAIL.replace(":boardId", board.id));
  };

  const renderBoards = useCallback(() => {
    return boards.map((board) => (
      <div
        key={board.id}
        onClick={() => handleBoardClick(board)}
        className="relative w-[200px] h-[100px] rounded-[4px] bg-white shadow-md flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="p-3">
          <div className="text-sm font-semibold text-gray-800 leading-tight truncate select-none">{board.name}</div>

          {board.description && (
            <div className="mt-1 truncate select-none text-[11px] text-gray-500">{board.description}</div>
          )}
        </div>
      </div>
    ));
  }, [boards]);

  return (
    <div className="mx-auto py-6 max-w-6xl text-gray-200">
      <h2 className="mb-4 select-none text-xs font-bold uppercase tracking-wider text-gray-400">YOUR WORKSPACES</h2>

      {isLoading ? (
        <div className="flex flex-wrap gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-[100px] w-[200px] animate-pulse rounded-[4px] bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {renderBoards()}

          <button
            onClick={() => setIsCreateOpen(true)}
            className="group flex h-[100px] w-[200px] cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-gray-600 bg-[#242A30]/50 transition-colors hover:border-gray-400 hover:bg-[#242A30]"
          >
            <span className="text-sm font-medium text-gray-400 transition-colors group-hover:text-gray-200">
              + Create a new board
            </span>
          </button>
        </div>
      )}

      {isCreateOpen && (
        <Suspense fallback={null}>
          <CreateBoardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={fetchBoards} />
        </Suspense>
      )}
    </div>
  );
}
