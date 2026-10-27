import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-[#27212A] dark:text-[#FDF2F8] tracking-wide"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#27212A] transition-all placeholder:text-[#5C5262]/50 focus:outline-none focus:ring-2 resize-y dark:bg-[#18111A] dark:text-[#FDF2F8] dark:placeholder:text-[#C4B5CD]/40",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-[#FBCFE8] focus:border-[#DB2777] focus:ring-[#DB2777]/20 dark:border-[#3D293F] dark:focus:border-[#F472B6] dark:focus:ring-[#F472B6]/20",
            props.disabled &&
              "bg-pink-50/50 text-slate-400 cursor-not-allowed dark:bg-[#231B26] dark:text-slate-600",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-[#5C5262] dark:text-[#C4B5CD]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
