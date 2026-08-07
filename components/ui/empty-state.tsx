import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[#E8ECF3] bg-white p-12 text-center",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-[#F1F5F9] p-3">
          <Icon className="h-6 w-6 text-[#6B7280]" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1A1A1A]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[#6B7280]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export { EmptyState };
