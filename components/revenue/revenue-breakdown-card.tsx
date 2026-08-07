import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface BreakdownItem {
  label: string;
  value: string;
  percentage: number;
  growth?: number;
  trend?: "up" | "down" | "neutral";
}

interface RevenueBreakdownCardProps {
  title: string;
  description?: string;
  items: BreakdownItem[];
  icon?: React.ReactNode;
  className?: string;
}

function RevenueBreakdownCard({
  title,
  description,
  items,
  icon,
  className,
}: RevenueBreakdownCardProps) {
  return (
    <Card padding="default" className={cn("", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
          {description && (
            <p className="text-sm text-[#6B7280]">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A1A1A]">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {item.growth !== undefined && (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      item.trend === "up"
                        ? "text-[#00C48C]"
                        : item.trend === "down"
                        ? "text-[#FF5C5C]"
                        : "text-[#6B7280]"
                    )}
                  >
                    {item.growth > 0 ? "+" : ""}{item.growth}%
                  </span>
                )}
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  {item.value}
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7C5CFC] transition-all duration-500"
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#6B7280]">
                {item.percentage}% of total
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { RevenueBreakdownCard, type BreakdownItem, type RevenueBreakdownCardProps };
