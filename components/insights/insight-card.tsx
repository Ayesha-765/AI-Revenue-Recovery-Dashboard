import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Eye,
  CheckCircle2,
} from "lucide-react";
import type { Insight, InsightPriority } from "@/app/actions/analyze-insights";

interface InsightCardProps {
  insight: Insight;
  onClick?: () => void;
  className?: string;
}

const priorityConfig: Record<InsightPriority, { label: string; variant: "danger" | "warning" | "info" | "secondary"; icon: React.ElementType; bgColor: string }> = {
  critical: { label: "Critical", variant: "danger", icon: AlertTriangle, bgColor: "bg-[#FF5C5C]/10" },
  high: { label: "High", variant: "warning", icon: AlertTriangle, bgColor: "bg-[#FFB800]/10" },
  medium: { label: "Medium", variant: "info", icon: TrendingDown, bgColor: "bg-[#4F8CFF]/10" },
  low: { label: "Low", variant: "secondary", icon: CheckCircle2, bgColor: "bg-[#6B7280]/10" },
};

function InsightCard({ insight, onClick, className }: InsightCardProps) {
  const priority = priorityConfig[insight.priority];
  const PriorityIcon = priority.icon;

  return (
    <Card
      hoverable
      padding="default"
      className={cn("group cursor-pointer", className)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={priority.variant} className="gap-1.5">
            <PriorityIcon className="h-3 w-3" />
            {priority.label}
          </Badge>
          {insight.confidence !== undefined && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {Math.round(insight.confidence * 100)}% confidence
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#7C5CFC] transition-colors">
        {insight.title}
      </h3>

      <p className="text-sm text-[#6B7280] mb-4 line-clamp-2 leading-relaxed">
        {insight.summary}
      </p>

      <div className="space-y-3">
        <div className="rounded-[10px] bg-[#7C5CFC]/5 px-3 py-2">
          <p className="text-xs text-[#6B7280]">Revenue Impact</p>
          <p className="text-sm font-semibold text-[#1A1A1A] truncate">
            {insight.impact}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#6B7280] uppercase">
            Recommended Action
          </p>
          <p className="text-sm text-[#1A1A1A] line-clamp-2">
            {insight.recommendation}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#6B7280]">
        <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
      </div>
    </Card>
  );
}

export { InsightCard, type InsightCardProps };
