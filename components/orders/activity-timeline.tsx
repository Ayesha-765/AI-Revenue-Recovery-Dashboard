import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Sparkles, Rocket, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info" | "pending" | "ai";
  icon: "success" | "warning" | "info" | "pending" | "ai";
}

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-[#00C48C]", bg: "bg-[#00C48C]/10" },
  warning: { icon: AlertCircle, color: "text-[#FFB800]", bg: "bg-[#FFB800]/10" },
  info: { icon: Rocket, color: "text-[#4F8CFF]", bg: "bg-[#4F8CFF]/10" },
  pending: { icon: Clock, color: "text-[#6B7280]", bg: "bg-[#F1F5F9]" },
  ai: { icon: Sparkles, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10" },
};

interface ActivityTimelineProps {
  title?: string;
  items?: ActivityItem[];
  className?: string;
}

const defaultItems: ActivityItem[] = [
  {
    id: "1",
    title: "New order received",
    description: "Order ORD-2847 placed by Sarah Johnson for $245.00",
    timestamp: "2 minutes ago",
    status: "success",
    icon: "success",
  },
  {
    id: "2",
    title: "Order shipped",
    description: "Order ORD-2844 has been shipped via Express Delivery",
    timestamp: "15 minutes ago",
    status: "info",
    icon: "info",
  },
  {
    id: "3",
    title: "Payment failed",
    description: "Payment failed for Order ORD-2845. Customer notified.",
    timestamp: "1 hour ago",
    status: "warning",
    icon: "warning",
  },
  {
    id: "4",
    title: "Refund processed",
    description: "Refund of $67.00 processed for Order ORD-2843",
    timestamp: "3 hours ago",
    status: "success",
    icon: "success",
  },
  {
    id: "5",
    title: "Customer cancelled order",
    description: "Order ORD-2840 was cancelled by the customer",
    timestamp: "5 hours ago",
    status: "pending",
    icon: "pending",
  },
];

function ActivityTimeline({
  title = "Recent Order Activity",
  items = defaultItems,
  className,
}: ActivityTimelineProps) {
  return (
    <Card padding="default" className={className}>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-[#6B7280]">Track order events and updates</p>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => {
          const config = statusConfig[item.icon];
          const Icon = config.icon;

          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    config.bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                {index < items.length - 1 && (
                  <div className="mt-2 h-full w-px bg-[#E8ECF3]" />
                )}
              </div>

              <div className="flex-1 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">{item.title}</p>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#6B7280] whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export { ActivityTimeline, type ActivityItem, type ActivityTimelineProps };
