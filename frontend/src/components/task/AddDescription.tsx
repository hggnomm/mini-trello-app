import { cn } from "@/utils/cn";
import { FiX } from "react-icons/fi";
import BaseButton from "@/base/baseButton";

interface AddDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
  saving?: boolean;
}

export default function AddDescription({
  value,
  onChange,
  onSave,
  onCancel,
  isEditing,
  onStartEdit,
  saving = false,
}: AddDescriptionProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a more detailed description..."
        rows={isEditing ? 4 : 2}
        onFocus={onStartEdit}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        className={cn("w-full resize-none rounded bg-white/[0.04] text-sm outline-none transition-all", {
          "p-2 border border-transparent shadow placeholder-gray-500 focus:border-white": isEditing,
          "cursor-pointer border border-white/10 px-3 py-2 text-gray-200 placeholder-gray-500 hover:bg-white/[0.07]":
            !isEditing,
        })}
      />

      {isEditing && (
        <div className="flex items-center gap-3">
          <BaseButton variant="secondary" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </BaseButton>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="flex items-center justify-center p-1 rounded-md text-white hover:text-slate-300 hover:bg-gray-800"
          >
            <FiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
