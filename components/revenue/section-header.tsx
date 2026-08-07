import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
        {description && (
          <p className="text-sm text-[#6B7280]">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export { SectionHeader, type SectionHeaderProps };
