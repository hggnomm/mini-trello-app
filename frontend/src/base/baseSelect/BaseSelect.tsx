import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

export type SelectItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
};

type BaseSelectProps = {
  trigger?: ReactNode;
  items: SelectItem[];
  selectedId?: string;
  className?: string;
  dropdownClassName?: string;
  triggerClassName?: string;
  onOpen?: () => void;
  align?: "left" | "right";
};

const BaseSelect = ({
  trigger,
  items,
  selectedId,
  className,
  dropdownClassName,
  triggerClassName,
  onOpen,
  align = "left",
}: BaseSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const toggle = () => {
    if (!isOpen && triggerRef.current) {
      updateCoords();
      onOpen?.();
    }
    setIsOpen((prev) => !prev);
  };

  const close = () => setIsOpen(false);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateCoords();
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={cn("inline-flex", className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={toggle}
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 rounded text-gray-200 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer",
          isOpen && "bg-gray-200 text-gray-800",
          triggerClassName,
        )}
      >
        {trigger ?? <span className="text-base font-bold leading-none tracking-widest select-none">···</span>}
      </button>

      {/* Dropdown — rendered in body portal, fully detached */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              style={{
                top: coords.top,
                ...(align === "right" ? { right: coords.right } : { left: coords.left }),
              }}
              className={cn(
                "fixed z-[9999] min-w-[140px] bg-white rounded shadow-lg border border-gray-200 flex flex-col",
                dropdownClassName,
              )}
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    close();
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer w-full",
                    item.id === selectedId && "font-medium text-white bg-gray-700",
                  )}
                >
                  {item.icon && (
                    <span className="inline-flex items-center justify-center shrink-0 text-base">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default BaseSelect;
