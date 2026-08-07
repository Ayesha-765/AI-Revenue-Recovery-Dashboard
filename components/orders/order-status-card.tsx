import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface OrderStatusCardProps {
  title: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  className?: string;
}

function OrderStatusCard({
  title,
  count,
  percentage,
  color,
  bgColor,
  icon,
  className,
}: OrderStatusCardProps) {
  return (
    <Card hoverable padding="default" className={cn("", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-[14px]", bgColor)}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B7280]">{title}</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{count}</p>
          </div>
        </div>
        <span className={cn("text-sm font-semibold", color)}>{percentage}%</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
        />
      </div>
    </Card>
  );
}

export { OrderStatusCard, type OrderStatusCardProps };
