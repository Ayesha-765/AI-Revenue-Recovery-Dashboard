import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIRecommendationProps {
  title?: string;
  description?: string;
  impact?: string;
  impactValue?: string;
  onApply?: () => void;
  className?: string;
}

function AIRecommendation({
  title = "Improve mobile checkout experience",
  description = "AI detected that 34% of mobile users abandon checkout due to a missing 'express pay' option and oversized form fields. Implementing Apple Pay and optimizing input sizes could recover significant revenue.",
  impact = "Expected revenue recovery",
  impactValue = "$12,400/mo",
  onApply,
  className,
}: AIRecommendationProps) {
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
                AI Recommendation
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-[14px] bg-[#F8FAFC] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00C48C]/10">
              <Zap className="h-5 w-5 text-[#00C48C]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">{impact}</p>
              <p className="text-lg font-bold text-[#00C48C]">{impactValue}</p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={onApply}
          >
            Apply Recommendation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { AIRecommendation, type AIRecommendationProps };
