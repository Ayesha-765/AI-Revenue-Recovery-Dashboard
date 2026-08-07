import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, AlertTriangle } from "lucide-react";

interface AIInsightCardProps {
  title?: string;
  description?: string;
  estimatedLoss?: string;
  estimatedValue?: string;
  recommendedActions?: string[];
  onViewDetails?: () => void;
  onGeneratePlan?: () => void;
  className?: string;
}

function AIInsightCard({
  title = "Mobile checkout abandonment increased by 24%",
  description = "AI detected that mobile users are abandoning checkout at the payment step due to missing express pay options and oversized form fields. This is costing you approximately $3,240 per month in lost revenue.",
  estimatedLoss = "Estimated lost revenue",
  estimatedValue = "$3,240/mo",
  recommendedActions = [
    "Improve mobile checkout flow",
    "Show shipping cost earlier",
    "Launch abandoned cart recovery campaign",
  ],
  onViewDetails,
  onGeneratePlan,
  className,
}: AIInsightCardProps) {
  return (
    <Card
      padding="lg"
      className={cn(
        "relative overflow-hidden border-[#7C5CFC]/20 bg-gradient-to-br from-white to-[#7C5CFC]/5",
        className
      )}
    >
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#7C5CFC]/5 to-transparent" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC] shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <Badge variant="default" className="gap-1.5">
                <Zap className="h-3 w-3" />
                AI Revenue Insight
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-[#1A1A1A]">
            Recommended Actions:
          </p>
          <ul className="space-y-2">
            {recommendedActions.map((action, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-[#6B7280]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-xs font-medium text-[#7C5CFC]">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-[14px] bg-[#F8FAFC] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5C5C]/10">
              <AlertTriangle className="h-5 w-5 text-[#FF5C5C]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">{estimatedLoss}</p>
              <p className="text-lg font-bold text-[#FF5C5C]">{estimatedValue}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onViewDetails}
            >
              View Details
            </Button>
            <Button onClick={onGeneratePlan}>
              Generate Action Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { AIInsightCard, type AIInsightCardProps };
