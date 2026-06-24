import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { acceptBoardInvitation } from "@/api/board";
import BaseSpinner from "@/base/baseSpinner";
import { ROUTES } from "@/constants/route.constant";

export default function BoardInviteAccept() {
  const { boardId } = useParams<{ boardId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const memberId = searchParams.get("memberId");

    if (!boardId || !memberId) {
      toast.error("Invalid invitation link");
      navigate(ROUTES.DASHBOARD, { replace: true });
      return;
    }

    void (async () => {
      try {
        await acceptBoardInvitation(boardId, memberId);
        navigate(ROUTES.BOARD_DETAIL.replace(":boardId", boardId), { replace: true });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    })();
    
  }, [boardId, navigate, searchParams]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <BaseSpinner className="!size-10" />
    </div>
  );
}
