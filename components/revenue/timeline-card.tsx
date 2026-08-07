import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Sparkles, Rocket, Clock } from "lucide-react";

interface TimelineItem {
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

interface TimelineCardProps {
  title?: string;
  items?: TimelineItem[];
  className?: string;
}

const defaultItems: TimelineItem[] = [
  {
    id: "1",
    title: "Revenue increased after campaign",
    description: "Abandoned cart recovery campaign resulted in $2,340 additional revenue this week.",
    timestamp: "2 hours ago",
    status: "success",
    icon: "success",
  },
  {
    id: "2",
    title: "Refund spike detected",
    description: "Refund rate increased by 3.2% in the last 24 hours. Product quality issue suspected.",
    timestamp: "5 hours ago",
    status: "warning",
    icon: "warning",
  },
  {
    id: "3",
    title: "High-value customer purchase",
    description: "Customer #4521 made a $1,240 purchase. Consider offering loyalty rewards.",
    timestamp: "8 hours ago",
    status: "info",
    icon: "success",
  },
  {
    id: "4",
    title: "New revenue opportunity identified",
    description: "AI detected potential for $4,200/mo by expanding to international markets.",
    timestamp: "1 day ago",
    status: "ai",
    icon: "ai",
  },
  {
    id: "5",
    title: "Weekly report generated",
    description: "Your weekly revenue recovery report is ready to view.",
    timestamp: "2 days ago",
    status: "pending",
    icon: "pending",
  },
];

function TimelineCard({
  title = "Recent Revenue Activity",
  items = defaultItems,
  className,
}: TimelineCardProps) {
  return (
    <Card padding="default" className={className}>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-[#6B7280]">
        Track revenue changes and opportunities
      </p>

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
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {item.title}
                    </p>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {item.description}
                    </p>
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

export { TimelineCard, type TimelineItem, type TimelineCardProps };
