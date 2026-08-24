import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface OrderAlert {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedImpact: string;
}

const priorityConfig = {
  critical: { label: "Critical", variant: "danger" as const, dotColor: "bg-[#FF5C5C]" },
  high: { label: "High", variant: "warning" as const, dotColor: "bg-[#FFB800]" },
  medium: { label: "Medium", variant: "info" as const, dotColor: "bg-[#4F8CFF]" },
  low: { label: "Low", variant: "secondary" as const, dotColor: "bg-[#6B7280]" },
};

interface OrderAlertCardProps {
  title?: string;
  alerts?: OrderAlert[];
  onAction?: (id: string) => void;
  className?: string;
}

function OrderAlertCard({
  title = "Order Alerts",
  alerts = [],
  onAction,
  className,
}: OrderAlertCardProps) {
  return (
    <Card padding="default" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#FFB800]" />
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
        </div>
        <span className="text-sm text-[#6B7280]">{alerts.length} active</span>
      </div>

      {alerts.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] mb-3">
            <AlertTriangle className="h-6 w-6 text-[#6B7280]" />
          </div>
          <p className="text-sm font-medium text-[#1A1A1A]">No active alerts</p>
          <p className="text-xs text-[#6B7280] mt-1">All orders are running smoothly.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {alerts.map((alert) => {
            const priority = priorityConfig[alert.priority];
            return (
              <div
                key={alert.id}
                className="group flex flex-col gap-4 rounded-[14px] border border-[#E8ECF3] p-5 transition-all duration-200 hover:border-[#7C5CFC]/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={priority.variant} className="gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", priority.dotColor)} />
                      {priority.label}
                    </Badge>
                    <h3 className="text-sm font-semibold text-[#1A1A1A]">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-[#6B7280]">Impact:</span>
                    <span className="font-semibold text-[#1A1A1A]">{alert.estimatedImpact}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 group-hover:border-[#7C5CFC] group-hover:text-[#7C5CFC]"
                  onClick={() => onAction?.(alert.id)}
                >
                  Take Action
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export { OrderAlertCard, type OrderAlert, type OrderAlertCardProps };
