import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "secondary";
  className?: string;
}

const statusColorMap: Record<string, string> = {
  paid: "bg-[#00C48C]/10 text-[#00C48C]",
  pending: "bg-[#FFB800]/10 text-[#D4A000]",
  failed: "bg-[#FF5C5C]/10 text-[#FF5C5C]",
  refunded: "bg-[#F1F5F9] text-[#6B7280]",
  processing: "bg-[#4F8CFF]/10 text-[#4F8CFF]",
  shipped: "bg-[#7C5CFC]/10 text-[#7C5CFC]",
  delivered: "bg-[#00C48C]/10 text-[#00C48C]",
  cancelled: "bg-[#FF5C5C]/10 text-[#FF5C5C]",
};

function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColorMap[status.toLowerCase()] || "bg-[#F1F5F9] text-[#6B7280]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[10px] px-2.5 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
}

export { StatusBadge, type StatusBadgeProps };
