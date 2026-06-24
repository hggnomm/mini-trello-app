import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { HiX } from "react-icons/hi";
import { inviteUserToBoard, getBoardMembers, type Board, type BoardMember } from "../../api/board";
import BaseButton from "../../base/baseButton";
import BaseInput from "../../base/baseInput";
import BaseModal from "../../base/baseModal";

type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
};

type InviteFormValues = {
  email: string;
};

export default function InviteMemberModal({ isOpen, onClose, board }: InviteMemberModalProps) {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<InviteFormValues>({
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (!isOpen || !board.id) return;

    let cancelled = false;

    getBoardMembers(board.id)
      .then((data) => {
        if (!cancelled) setMembers(data);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [isOpen, board.id]);

  const refreshMembers = () => {
    getBoardMembers(board.id).then(setMembers).catch(console.error);
  };

  const onInvite = async ({ email }: InviteFormValues) => {
    setLoading(true);

    try {
      await inviteUserToBoard(board.id, {
        board_owner_id: board.ownerId,
        email_member: email.trim(),
      });

      toast.success("Invitation sent successfully!");
      reset({ email: "" });
      
      refreshMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <HiX size={20} />
      </button>

      <h3 className="text-lg font-bold text-white mb-4">Invite Member</h3>

      <form onSubmit={handleSubmit(onInvite)} className="flex gap-2 mb-6">
        <div className="flex-1">
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <BaseInput
                type="email"
                placeholder="Email address"
                variant="secondary"
                value={field.value}
                onChange={field.onChange}
                onClear={() => setValue("email", "")}
                disabled={loading}
              />
            )}
          />
        </div>
        <BaseButton variant="primary" type="submit" loading={loading}>
          Invite
        </BaseButton>
      </form>

      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-3 border-b border-gray-700 pb-2">
          Board members <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded text-xs">{members.length}</span>
        </h4>

        <div className="flex flex-col gap-3">
          {members?.map((member) => {
            const status = board.ownerId === member.id ? "Owner" : board.listMembers?.[member.id] || "pending";

            return (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {member.name} {board.ownerId === member.id && "(owner)"}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="text-xs capitalize text-gray-400 bg-gray-800 px-2 py-1 rounded">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseModal>
  );
}
