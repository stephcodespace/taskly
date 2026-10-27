import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "low"
    | "medium"
    | "high"
    | "todo"
    | "in_progress"
    | "done"
    | "overdue"
    | "default";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-lg border tracking-tight transition-colors";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantStyles = {
    // Priorities (WCAG AA Compliant contrast)
    low: "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
    medium:
      "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
    high: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",

    // Statuses
    todo: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1F1722] dark:text-[#C4B5CD] dark:border-[#3D293F]",
    in_progress:
      "bg-pink-50 text-[#DB2777] border-[#FBCFE8] dark:bg-[#381A2D] dark:text-[#F472B6] dark:border-[#523755]",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",

    // Overdue Indicator
    overdue:
      "bg-rose-100 text-rose-800 border-rose-300 font-semibold dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",

    // Default
    default:
      "bg-pink-50/70 text-[#5C5262] border-[#FBCFE8] dark:bg-[#231B26] dark:text-[#C4B5CD] dark:border-[#3D293F]",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
