import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-[14px] border bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200",
            error
              ? "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
              : "border-[#E8ECF3] hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
