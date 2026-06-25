import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

export type BaseEditableTitleProps = {
  value: string;
  onSave: (newTitle: string) => Promise<boolean | void>;
  disabled?: boolean;
  className?: string;
};

export default function BaseEditableTitle({ value, onSave, disabled = false, className }: BaseEditableTitleProps) {
  const [title, setTitle] = useState(value);

  useEffect(() => {
    setTitle(value);
  }, [value]);

  const handleSave = async () => {
    if (disabled) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitle(value);
      return;
    }
    if (trimmedTitle === value) return;

    try {
      const success = await onSave(trimmedTitle);
      // If the onSave function explicitly returns false, it means it failed
      if (success === false) {
        setTitle(value);
      }
    } catch {
      setTitle(value);
    }
  };

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      disabled={disabled}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className={cn(
        "bg-transparent rounded border border-transparent focus:border-white focus:outline-none transition-all disabled:opacity-100 disabled:cursor-not-allowed",
        className,
      )}
    />
  );
}
