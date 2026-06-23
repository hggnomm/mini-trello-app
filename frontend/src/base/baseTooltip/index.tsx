import clsx from "clsx";
import { type ReactNode, useRef, useState } from "react";

import { TOOLTIP_POSITION } from "@/constants/tooltip";
import { getTooltipPositionClasses } from "@/utils/tooltip";

type BaseTooltipProps = {
  content: ReactNode;
  position?: string;
  children: ReactNode;
  className?: string;
};

const BaseTooltip = ({ content, position = TOOLTIP_POSITION.TOP, children, className }: BaseTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const delay = 500;

  const handleMouseEnter = () => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  return (
    <div
      className={clsx("relative inline-flex items-center overflow-visible", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <span
          className={clsx(
            "absolute rounded-[8px] w-max max-w-[350px] bg-white border border-black/10 px-3.5 py-2 z-50 duration-200 flex items-center shadow-xl text-gray-600 text-sm font-normal wrap-break-word",
            getTooltipPositionClasses(position),
          )}
        >
          {content}
        </span>
      )}
    </div>
  );
};

export default BaseTooltip;
