import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Rocket, 
  Clock,
  MoreHorizontal
} from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info" | "pending";
  icon: "success" | "warning" | "info" | "pending" | "ai";
}

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-[#00C48C]", bg: "bg-[#00C48C]/10" },
  warning: { icon: AlertCircle, color: "text-[#FFB800]", bg: "bg-[#FFB800]/10" },
  info: { icon: Rocket, color: "text-[#4F8CFF]", bg: "bg-[#4F8CFF]/10" },
  pending: { icon: Clock, color: "text-[#6B7280]", bg: "bg-[#F1F5F9]" },
  ai: { icon: Sparkles, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10" },
};

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Store synced successfully",
    description: "Your Shopify store data has been synchronized. 1,247 products updated.",
    timestamp: "2 minutes ago",
    status: "success",
    icon: "success",
  },
  {
    id: "2",
    title: "New revenue problem detected",
    description: "AI identified a critical issue: mobile checkout abandonment increased by 34%.",
    timestamp: "15 minutes ago",
    status: "warning",
    icon: "ai",
  },
  {
    id: "3",
    title: "AI recommendation generated",
    description: "New recommendation available: Implement express pay to recover $12,400/mo.",
    timestamp: "1 hour ago",
    status: "info",
    icon: "ai",
  },
  {
    id: "4",
    title: "Campaign created",
    description: "Abandoned cart recovery email sequence launched for 847 customers.",
    timestamp: "3 hours ago",
    status: "success",
    icon: "success",
  },
  {
    id: "5",
    title: "Weekly report generated",
    description: "Your weekly revenue recovery report is ready to view.",
    timestamp: "5 hours ago",
    status: "pending",
    icon: "pending",
  },
];

interface RecentActivityProps {
  activities?: ActivityItem[];
  className?: string;
}

function RecentActivity({
  activities = defaultActivities,
  className,
}: RecentActivityProps) {
  return (
    <Card padding="default" className={className}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          Recent Activity
        </h2>
        <button className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {activities.map((activity, index) => {
          const config = statusConfig[activity.icon];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.bg)}>
                  <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                {index < activities.length - 1 && (
                  <div className="mt-2 h-full w-px bg-[#E8ECF3]" />
                )}
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {activity.title}
                    </p>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[#6B7280] whitespace-nowrap">
                    {activity.timestamp}
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

export { RecentActivity, type ActivityItem, type RecentActivityProps };
