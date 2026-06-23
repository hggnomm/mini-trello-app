import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import BaseSpinner from "../baseSpinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
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
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",

          "bg-slate-600 text-white hover:bg-slate-700": variant === "secondary",

          "bg-red-600 text-white hover:bg-red-700": variant === "danger",

          "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50": variant === "outline",

          "bg-transparent text-slate-700 hover:bg-slate-100": variant === "ghost",
        },
        className,
      )}
      {...props}
    >
      {loading && <BaseSpinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

export default BaseButton;
