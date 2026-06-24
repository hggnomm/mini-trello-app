import { useState } from "react";
import { IoBarChartSharp, IoPulseOutline, IoDuplicateOutline } from "react-icons/io5";
import { FiChevronUp, FiChevronDown, FiUsers, FiPlus, FiSettings } from "react-icons/fi";
import type { IconType } from "react-icons";
import { cn } from "../utils/cn";

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: IconType;
  active?: boolean;
  endContent?: React.ReactNode;
};

function SidebarLink({ href, label, icon: Icon, active = false, endContent }: SidebarLinkProps) {
  return (
    <a
      href={href}
      className={cn("group flex items-center justify-between rounded px-3 py-2 text-sm font-medium mb-1", {
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
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

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

  return (
    <aside className="hidden h-full w-[300px] shrink-0 overflow-y-auto bg-[#2F3840] p-10 pr-0 text-[#dfe1e6] md:flex md:flex-col">
      <div className="flex flex-col gap-4">
        {/* Top Navigation */}
        <nav className="flex flex-col gap-1">
          {topNavItems.map((item) => (
            <SidebarLink key={item.label} href={item.href} label={item.label} icon={item.icon} active={item.active} />
          ))}
        </nav>

        <hr className="border-[#4b5864]" />

        {/* Workspace */}
        <div>
          <span className="mb-2 block px-3 text-xs font-bold uppercase tracking-wider text-[#9fadbc]">Workspaces</span>

          <button
            onClick={() => setIsWorkspaceOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-[#dfe1e6] transition-colors hover:bg-[#3f4a54]/50"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#00875a] text-xs font-bold text-white">
                T
              </div>

              <span className="text-sm font-medium">Trello Workspace</span>
            </div>

            {isWorkspaceOpen && <FiChevronUp />}
            {!isWorkspaceOpen && <FiChevronDown />}
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
    </aside>
  );
}
