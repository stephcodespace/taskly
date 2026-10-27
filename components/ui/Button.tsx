import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-[#DB2777] text-white hover:bg-[#BE185D] active:bg-[#9D174D] shadow-xs hover:shadow-sm dark:bg-[#DB2777] dark:hover:bg-[#BE185D]",
      secondary:
        "bg-white text-[#27212A] border border-[#FBCFE8] hover:bg-pink-50/50 hover:border-[#F472B6] active:bg-pink-100/60 shadow-2xs dark:bg-[#231B26] dark:text-[#FDF2F8] dark:border-[#3D293F] dark:hover:bg-[#2E2332] dark:hover:border-[#523755]",
      outline:
        "bg-transparent text-[#DB2777] border border-[#FBCFE8] hover:bg-[#FCE7F3]/60 active:bg-[#FCE7F3] dark:text-[#F472B6] dark:border-[#3D293F] dark:hover:bg-[#381A2D]",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs hover:shadow-sm focus-visible:ring-rose-500",
      ghost:
        "bg-transparent text-[#5C5262] hover:bg-pink-50/80 hover:text-[#27212A] active:bg-pink-100/60 dark:text-[#C4B5CD] dark:hover:bg-[#2E2332] dark:hover:text-[#FDF2F8]",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-4 py-2 rounded-xl gap-2",
      lg: "text-base px-5 py-2.5 rounded-xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
