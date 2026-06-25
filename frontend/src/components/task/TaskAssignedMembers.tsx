import { MdOutlinePersonAddAlt } from "react-icons/md";
import BaseSelect, { type SelectItem } from "@/base/baseSelect/BaseSelect";
import { formatDate } from "@/utils/date";
import type { Task } from "@/api/task";
import type { BoardMember } from "@/api/board";

type TaskAssignedMembersProps = {
  task: Task;
  boardMembers: BoardMember[];
  memberSelectItems: SelectItem[];
  onToggleMember: (memberId: string) => void;
  onMemberPickerOpen: () => void;
};

export default function TaskAssignedMembers({
  task,
  boardMembers,
  memberSelectItems,
  onToggleMember,
  onMemberPickerOpen,
}: TaskAssignedMembersProps) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
      <div>
        <p className="font-semibold text-gray-500 mb-1.5 uppercase tracking-wide text-[10px]">Members</p>
        <div className="flex items-center gap-2">
          {task.assignedMembers?.map((memberId: string) => {
            const member = boardMembers.find((m) => m.id === memberId);
            const displayName = member?.name ?? memberId;
            return (
              <div
                key={memberId}
                title={displayName}
                className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
                onClick={() => onToggleMember(memberId)}
              >
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            );
          })}
          <BaseSelect
            items={memberSelectItems}
            onOpen={onMemberPickerOpen}
            trigger={
              <button
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                title="Add member"
              >
                <MdOutlinePersonAddAlt size={15} />
              </button>
            }
            triggerClassName="!w-auto !h-auto !bg-transparent !p-0 !rounded-none"
            dropdownClassName="!bg-[#1e2329] !border-white/10 !shadow-2xl !min-w-[200px]"
          />
        </div>
      </div>

      {task.createdAt && (
        <div>
          <p className="font-semibold text-gray-500 mb-1.5 uppercase tracking-wide text-[10px]">Created</p>
          <p className="text-gray-300 text-xs py-1.5">{formatDate(task.createdAt)}</p>
        </div>
      )}
    </div>
  );
}
