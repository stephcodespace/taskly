import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-[#27212A] dark:text-[#FDF2F8] tracking-wide"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-[#27212A] transition-all focus:outline-none focus:ring-2 cursor-pointer dark:bg-[#18111A] dark:text-[#FDF2F8]",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-[#FBCFE8] focus:border-[#DB2777] focus:ring-[#DB2777]/20 dark:border-[#3D293F] dark:focus:border-[#F472B6] dark:focus:ring-[#F472B6]/20",
              props.disabled &&
                "bg-pink-50/50 text-slate-400 cursor-not-allowed dark:bg-[#231B26] dark:text-slate-600",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-white text-[#27212A] dark:bg-[#231B26] dark:text-[#FDF2F8]"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#DB2777] dark:text-[#F472B6]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
