import type { ChangeEvent, FocusEvent, ReactNode } from "react";
import { cn } from "../../utils/cn";

type BaseInputProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  leftIcon?: ReactNode;
  disabled?: boolean;
  type?: string;
  onClear?: () => void;
  align?: "left" | "center" | "right";
};

const BaseInput = ({
  id,
  value,
  defaultValue,
  placeholder,
  onChange,
  onFocus,
  className,
  inputClassName,
  leftIcon,
  disabled = false,
  type = "text",
  onClear,
  align = "left",
}: BaseInputProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 bg-white w-full rounded-sm border border-[#565D6D] px-3 py-2 h-auto shadow-none focus-within:border-blue-500 transition",
        {
          "opacity-50 cursor-not-allowed": disabled,
        },
        className,
      )}
    >
      {leftIcon && (
        <span className="inline-flex items-center justify-center text-xl text-neutral-600 font-medium shrink-0">
          {leftIcon}
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        disabled={disabled}
        className={cn(
          "flex-1 bg-transparent border-none outline-none text-sm text-black w-full",
          {
            "text-left": align === "left",
            "text-left placeholder-shown:text-center": align === "center",
            "text-right placeholder-shown:text-center": align === "right",
          },
          inputClassName,
        )}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default BaseInput;
