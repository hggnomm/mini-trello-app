import BaseModal from "@/base/baseModal";
import BaseButton from "@/base/baseButton";
import CloseButton from "@/base/baseButton/CloseButton";
import { HiOutlineExclamationCircle } from "react-icons/hi";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
};

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this?",
  loading = false,
}: ConfirmDeleteModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="!max-w-[400px]">
      <CloseButton onClick={onClose} />

      <div className="flex flex-col items-center justify-center text-center px-4 py-2 mt-2">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
          <HiOutlineExclamationCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>

        <div className="flex w-full gap-3">
          <BaseButton variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            onClick={onConfirm}
            loading={loading}
            className="flex-1 !bg-red-500 hover:!bg-red-600 !text-white"
          >
            Delete
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  );
}
