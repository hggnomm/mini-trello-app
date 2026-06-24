import { useEffect, useState } from "react";
import { searchUsers, type UserProfile } from "../../api/user";
import type { BoardMember } from "../../api/board";
import BaseInput from "../../base/baseInput";

type SearchUserProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onMatchUserId: (id: string | null) => void;
  excludeMembers?: BoardMember[];
  disabled?: boolean;
  onSearchingStatusChange?: (loading: boolean) => void;
};

export default function SearchUser({
  value,
  onChange,
  onClear,
  onMatchUserId,
  excludeMembers = [],
  disabled,
  onSearchingStatusChange,
}: SearchUserProps) {
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onMatchUserId(null);

    const keyword = value.trim();

    if (keyword.length < 2) {
      setUsers([]);
      setOpen(false);
      onSearchingStatusChange?.(false);
      return;
    }

    onSearchingStatusChange?.(true);

    const timeout = setTimeout(async () => {
      try {
        const results = await searchUsers(keyword);

        const list = results.filter((user) => !excludeMembers.some((member) => member.id === user.id));

        setUsers(list);

        if (list.length === 1 && list[0].email === keyword) {
          setOpen(false);
          onMatchUserId(list[0].id);
        } else {
          setOpen(true);
        }
      } catch (error) {
        console.error("Failed to search users", error);
      } finally {
        onSearchingStatusChange?.(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, excludeMembers]);

  return (
    <div className="relative flex-1">
      <BaseInput
        type="email"
        placeholder="Email address"
        variant="secondary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={onClear}
        disabled={disabled}
      />

      {open && users.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border border-gray-700 bg-[#1a1c23] shadow-xl">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-700"
              onClick={() => {
                onChange(user.email);
                onMatchUserId(user.id);
                setOpen(false);
              }}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>

              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-gray-200">{user.name || user.email.split("@")[0]}</span>
                <span className="truncate text-xs text-gray-400">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
