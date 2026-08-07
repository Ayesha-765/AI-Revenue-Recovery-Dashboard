import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, AlertTriangle } from "lucide-react";

interface AIOrderInsightCardProps {
  title?: string;
  description?: string;
  estimatedImpact?: string;
  estimatedValue?: string;
  recommendedActions?: string[];
  onInvestigate?: () => void;
  onGeneratePlan?: () => void;
  className?: string;
}

function AIOrderInsightCard({
  title = "Increased failed payments from mobile users",
  description = "AI detected a 34% increase in payment failures from mobile users in the last 48 hours. The primary cause appears to be payment gateway timeouts during peak hours. This is resulting in approximately $1,240 in lost revenue per week.",
  estimatedImpact = "Potential lost revenue",
  estimatedValue = "$1,240/week",
  recommendedActions = [
    "Review payment gateway configuration and timeout settings",
    "Retry failed payments automatically",
    "Notify affected customers via email",
    "Consider adding alternative payment methods",
  ],
  onInvestigate,
  onGeneratePlan,
  className,
}: AIOrderInsightCardProps) {
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
                AI Order Insight
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">{title}</h2>
          <p className="text-sm text-[#6B7280] leading-relaxed max-w-3xl">{description}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-[#1A1A1A]">Recommended Actions:</p>
          <ul className="space-y-2">
            {recommendedActions.map((action, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-[#6B7280]">
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
              <p className="text-xs text-[#6B7280]">{estimatedImpact}</p>
              <p className="text-lg font-bold text-[#FF5C5C]">{estimatedValue}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onInvestigate}>
              Investigate
            </Button>
            <Button onClick={onGeneratePlan}>
              Generate Recovery Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { AIOrderInsightCard, type AIOrderInsightCardProps };
