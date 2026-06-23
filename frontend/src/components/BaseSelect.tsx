import { type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiDotsHorizontal, HiX } from "react-icons/hi";
import { cn } from "../utils/cn";
import BaseGlassButton from "./BaseGlassButton";

const POSITION_BOTTOM = "bottom" as const;
const POSITION_TOP = "top" as const;

export type SelectItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  onClose?: () => void;
};

type BaseSelectProps = {
  trigger?: ReactNode;
  items: SelectItem[];
  selectedId?: string;
  className?: string;
  dropdownClassName?: string;
  position?: typeof POSITION_BOTTOM | typeof POSITION_TOP;
  openOnHover?: boolean;
  enableItemClose?: boolean;
  showMoreOnHover?: boolean;
};

const BaseSelect = ({
  trigger,
  items,
  selectedId,
  className,
  dropdownClassName,
  position = POSITION_TOP,
  openOnHover = false,
  enableItemClose = false,
  showMoreOnHover = false,
}: BaseSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedItem = items.find((item) => item.id === selectedId);

  const triggerContent = trigger ?? (
    <div className="flex items-center gap-1">
      {selectedItem?.icon && (
        <span className="inline-flex items-center justify-center text-lg text-gray-200">{selectedItem.icon}</span>
      )}
      <span className="text-base text-gray-100 whitespace-nowrap truncate max-w-[180px]">
        {selectedItem?.label || "Select"}
      </span>
      {showMoreOnHover && isOpen && (
        <BaseGlassButton
          icon={<HiDotsHorizontal />}
          isTransparent
          iconSize="text-[0.875rem]! hover:text-white"
          className="w-3! h-3! ml-1 hover:bg-transparent"
        />
      )}
    </div>
  );

  return (
    <div
      className={cn("relative inline-flex group", className)}
      ref={dropdownRef}
      onMouseEnter={openOnHover ? open : undefined}
      onMouseLeave={openOnHover ? close : undefined}
    >
      <button
        onClick={openOnHover ? undefined : toggle}
        className="inline-flex items-center justify-center gap-1 bg-black/15 border hover:border-black/20 border-transparent text-primary hover:bg-primary hover:text-white active:brightness-95 pl-2 pr-3 h-10 rounded-[14px] cursor-pointer transition-colors"
      >
        {triggerContent}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 left-0 py-1",
              position === POSITION_BOTTOM && "top-[calc(100%+8px)]",
              position !== POSITION_BOTTOM && "bottom-[calc(100%+8px)]",
              dropdownClassName,
            )}
          >
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    close();
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 26,
                    mass: 0.7,
                    delay: 0.02 * (items.length - index),
                  }}
                  className={cn(
                    "group/item hover:scale-105 will-change-transform relative flex items-center justify-start h-10 rounded-[14px] bg-black/15 border hover:border-black/20 border-transparent text-primary hover:bg-primary hover:text-white active:brightness-95 cursor-pointer transition-colors duration-300 w-max",
                    item.id === selectedId && "bg-primary text-white border-black/20!",
                    item.id !== selectedId && "bg-black/20",
                  )}
                >
                  <div className="flex items-center gap-1 pl-2 pr-3 h-10 rounded-[14px] transition-transform will-change-transform group-hover/item:scale-[1.02]">
                    {item.icon && (
                      <span className="inline-flex items-center justify-center text-lg text-gray-200">{item.icon}</span>
                    )}
                    <span className="text-base text-gray-100 max-w-[180px] whitespace-nowrap truncate">
                      {item.label}
                    </span>
                    {enableItemClose && item.onClose && (
                      <BaseGlassButton
                        icon={<HiX />}
                        onClick={item.onClose}
                        isTransparent
                        iconSize="text-[0.875rem]! hover:text-white"
                        className="w-3! h-3! ml-1 hover:bg-transparent"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BaseSelect;
