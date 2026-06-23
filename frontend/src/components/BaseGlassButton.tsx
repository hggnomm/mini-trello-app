import type { ReactNode } from "react";
import { cn } from "../utils/cn";

type BaseGlassButtonProps = {
  icon: ReactNode;
  isTransparent?: boolean;
  iconSize?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function BaseGlassButton({
  icon,
  isTransparent = false,
  iconSize,
  className,
  onClick,
}: BaseGlassButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering dropdown toggle when clicking nested button
        onClick?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
        isTransparent ? "bg-transparent text-gray-400 hover:text-white" : "bg-white/10 hover:bg-white/20 text-white",
        className
      )}
    >
      <span className={cn("inline-flex items-center justify-center", iconSize)}>
        {icon}
      </span>
    </button>
  );
}
