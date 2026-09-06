import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { Insight, InsightPriority } from "@/app/actions/analyze-insights";

interface InsightDetailsDrawerProps {
  insight: Insight;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProblem?: () => void;
}

const priorityConfig: Record<InsightPriority, { label: string; variant: "danger" | "warning" | "info" | "secondary" }> = {
  critical: { label: "Critical", variant: "danger" },
  high: { label: "High", variant: "warning" },
  medium: { label: "Medium", variant: "info" },
  low: { label: "Low", variant: "secondary" },
};

function InsightDetailsDrawer({
  insight,
  isOpen,
  onClose,
  onNavigateToProblem,
}: InsightDetailsDrawerProps) {
  if (!isOpen) return null;

  const priority = priorityConfig[insight.priority];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[20px] bg-white p-0 shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#E8ECF3] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-[14px]", "bg-[#7C5CFC]/10")}>
              <Sparkles className="h-5 w-5 text-[#7C5CFC]" />
            </div>
            <div>
              <Badge variant={priority.variant} className="gap-1">
                {priority.label}
              </Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
            {insight.title}
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
            {insight.summary}
          </p>

          {insight.confidence !== undefined && (
            <div className="mb-6 flex items-center gap-2 rounded-[10px] bg-[#F8FAFC] px-4 py-3">
              <Sparkles className="h-4 w-4 text-[#7C5CFC]" />
              <span className="text-sm text-[#6B7280]">
                AI Confidence: {Math.round(insight.confidence * 100)}%
              </span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
                AI Analysis
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {insight.analysis}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
                Revenue Impact
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {insight.impact}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
                Why This Matters
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Revenue problems compound over time. Addressing this issue promptly can prevent further revenue leakage
                and improve overall store performance. Every improvement in conversion rate or reduction in churn
                directly impacts your bottom line.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
                Recommended Actions
              </h3>
              <ul className="space-y-2">
                {insight.recommendation
                  .split(". ")
                  .filter((s) => s.length > 0)
                  .map((action, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-[#6B7280]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-xs font-medium text-[#7C5CFC]">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                        {action.endsWith(".") ? "" : "."}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {insight.problemId && (
              <div className="border-t border-[#E8ECF3] pt-4">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
                  Related Problem
                </h3>
                <p className="text-sm text-[#6B7280] mb-3">
                  This insight was generated from a detected revenue problem.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToProblem}
                >
                  View Revenue Problems
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { InsightDetailsDrawer, type InsightDetailsDrawerProps };
