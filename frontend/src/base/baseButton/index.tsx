import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import BaseSpinner from "../baseSpinner";

type ButtonVariant = "primary" | "outline" | "ghost";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
};

const BaseButton = ({
  variant = "primary",
  loading = false,
  children,
  className,
  disabled,
  type = "button",
  ...props
}: BaseButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-sm py-2.5 px-4 text-[12px] font-normal transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-[#0052CC] text-white hover:bg-[#0065FF] border border-transparent": variant === "primary",
          "bg-transparent text-[#0052CC] border border-[#0052CC] hover:bg-[#0052CC]/5": variant === "outline",
          "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent":
            variant === "ghost",
        },
        className
      )}
      {...props}
    >
      {loading && <BaseSpinner className="-ml-1 mr-2" />}
      {children}
    </button>
  );
};

export default BaseButton;
