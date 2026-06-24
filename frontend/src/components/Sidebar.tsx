import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoBarChartSharp, IoDuplicateOutline, IoPulseOutline } from "react-icons/io5";
import { FiChevronDown, FiChevronUp, FiFolder, FiPlus, FiSettings, FiUsers } from "react-icons/fi";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { getBoardById, getBoardMembers, type Board, type BoardMember } from "@/api/board";
import BaseSpinner from "@/base/baseSpinner";
import { getMemberInitials } from "@/utils/user";

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: IconType;
  active?: boolean;
  endContent?: ReactNode;
};

const topNavItems = [
  {
    label: "Boards",
    href: "#",
    icon: IoBarChartSharp,
    active: true,
  },
  {
    label: "Templates",
    href: "#",
    icon: IoDuplicateOutline,
  },
  {
    label: "Home",
    href: "#",
    icon: IoPulseOutline,
  },
];

const workspaceItems = [
  {
    label: "Boards",
    href: "#",
    icon: IoBarChartSharp,
    active: true,
  },
  {
    label: "Members",
    href: "#",
    icon: FiUsers,
    endContent: (
      <span className="rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white">
        <FiPlus />
      </span>
    ),
  },
  {
    label: "Settings",
    href: "#",
    icon: FiSettings,
  },
];

function SidebarLink({ href, label, icon: Icon, active = false, endContent }: SidebarLinkProps) {
  return (
    <a
      href={href}
      className={cn("group mb-1 flex items-center justify-between rounded px-3 py-2 text-sm font-medium", {
        "border border-[#9095A1] bg-[#1d2125] text-white": active,
        "text-[#dfe1e6] hover:bg-[#3f4a54]/50": !active,
      })}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn("text-lg", {
            "text-[#579dff]": active,
            "text-gray-300": !active,
          })}
        />
        <span>{label}</span>
      </div>

      {endContent}
    </a>
  );
}

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const { boardId } = useParams();

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) {
        setCurrentBoard(null);
        setBoardMembers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const [boardData, membersData] = await Promise.all([getBoardById(boardId), getBoardMembers(boardId)]);

        setCurrentBoard(boardData);
        setBoardMembers(membersData);
      } catch (error) {
        setCurrentBoard(null);
        setBoardMembers([]);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

  const renderBoardSidebar = () => {
    if (isLoading || !currentBoard) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <BaseSpinner />
        </div>
      );
    }

    if (!boardId) {
      return null;
    }

    const membersById = new Map(boardMembers.map((member) => [member.id, member]));
    const memberIds = Array.from(new Set([currentBoard.ownerId, ...Object.keys(currentBoard.listMembers ?? {})]));

    return (
      <div className="flex flex-1 flex-col gap-4 px-6 py-2">
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-sm font-medium text-gray-200">
            <FiFolder size={16} className="text-pink-500" />
            <span>{currentBoard.name}</span>
          </div>

          <div className="mt-1 flex flex-col gap-3 pl-6">
            <div className="flex items-center gap-2.5 text-sm text-gray-300">
              <FiUsers size={15} />
              <span>Members</span>
            </div>

            <div className="mt-2 flex flex-col gap-3.5 pl-6">
              {memberIds?.map((userId, index) => {
                const member = membersById.get(userId);
                const displayName = member?.name || member?.email || `User ${index + 1}`;
                const initials = getMemberInitials(displayName);

                return (
                  <div key={userId} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e53935] text-[11px] font-bold text-white">
                      <p className="mt-0.5">{initials}</p>
                    </div>

                    <span className="text-xs text-gray-300">{displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkspaceSidebar = () => (
    <div className="flex flex-col gap-4 p-10 pr-0">
      <nav className="flex flex-col gap-1">
        {topNavItems.map((item) => (
          <SidebarLink key={item.label} href={item.href} label={item.label} icon={item.icon} active={item.active} />
        ))}
      </nav>

      <hr className="border-[#4b5864]" />

      <div>
        <span className="mb-2 block px-3 text-xs font-bold uppercase tracking-wider text-[#9fadbc]">Workspaces</span>

        <button
          onClick={() => setIsWorkspaceOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded px-3 py-2 text-left transition-colors hover:bg-[#3f4a54]/50"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#00875a] text-xs font-bold text-white">
              T
            </div>

            <span className="text-sm font-medium">Trello Workspace</span>
          </div>

          {isWorkspaceOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {isWorkspaceOpen && (
          <div className="mt-1 flex flex-col gap-1.5 pl-4">
            {workspaceItems.map((item) => (
              <SidebarLink
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                endContent={item.endContent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <aside className="hidden h-full w-[300px] shrink-0 overflow-y-auto border-r border-white/5 bg-[#2F3840] text-[#dfe1e6] md:flex md:flex-col">
      {boardId ? renderBoardSidebar() : renderWorkspaceSidebar()}
    </aside>
  );
}
