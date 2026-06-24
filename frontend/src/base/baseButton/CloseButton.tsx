import { HiX } from "react-icons/hi";
import { cn } from "@/utils/cn";

type CloseButtonProps = {
  onClick: () => void;
  size?: number;
  className?: string;
};

export default function CloseButton({ onClick, size = 18, className }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      className={cn(
        "absolute top-3 right-3 text-gray-400 hover:text-white transition-colors rounded p-1 hover:bg-white/10 z-10",
        className,
      )}
    >
      <HiX size={size} />
    </button>
  );
}
