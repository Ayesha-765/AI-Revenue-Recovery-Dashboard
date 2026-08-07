import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface OrderStatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  previousValue?: string;
  className?: string;
}

function OrderStatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-[#7C5CFC]",
  iconBg = "bg-[#7C5CFC]/10",
  trend = "up",
  previousValue,
  className,
}: OrderStatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-[#00C48C]" : trend === "down" ? "text-[#FF5C5C]" : "text-[#6B7280]";

  return (
    <Card hoverable padding="default" className={cn("group relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#6B7280]">{title}</p>
          <p className="text-3xl font-bold text-[#1A1A1A] tracking-tight">{value}</p>
          {previousValue && (
            <p className="text-xs text-[#6B7280]">Previous: {previousValue}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <TrendIcon className={cn("h-4 w-4", trendColor)} />
              <span className={cn("text-sm font-semibold", trendColor)}>
                {change > 0 ? "+" : ""}{change}%
              </span>
              {changeLabel && <span className="text-sm text-[#6B7280]">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-[14px]", iconBg)}>
          <Icon className={cn("h-7 w-7", iconColor)} />
        </div>
      </div>
    </Card>
  );
}

export { OrderStatCard, type OrderStatCardProps };
