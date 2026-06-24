import { cn } from "@/utils/cn";

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
  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add a more detailed description..."
          rows={4}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
          }}
          className="w-full px-3 py-2.5 bg-black/30 border border-blue-500/60 rounded-lg text-sm text-gray-200 focus:outline-none resize-none placeholder:text-gray-600 transition-colors"
        />
        <div className="flex gap-2 items-center">
          <button
            disabled={saving}
            onClick={onSave}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-semibold rounded transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 text-gray-400 hover:text-white text-xs transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onStartEdit}
      className={cn(
        "w-full min-h-[60px] px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors",
        value ? "text-gray-300 hover:bg-white/5" : "text-gray-600 bg-white/[0.04] hover:bg-white/[0.07]",
      )}
    >
      {value || "Add a more detailed description..."}
    </div>
  );
}
