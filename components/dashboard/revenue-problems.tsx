import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RevenueProblem {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedImpact: string;
  estimatedValue?: string;
}

const severityConfig = {
  critical: { label: "Critical", variant: "danger" as const, dotColor: "bg-[#FF5C5C]" },
  high: { label: "High", variant: "warning" as const, dotColor: "bg-[#FFB800]" },
  medium: { label: "Medium", variant: "info" as const, dotColor: "bg-[#4F8CFF]" },
  low: { label: "Low", variant: "secondary" as const, dotColor: "bg-[#6B7280]" },
};

interface RevenueProblemsProps {
  problems?: RevenueProblem[];
  onInvestigate?: (id: string) => void;
  className?: string;
}

const defaultProblems: RevenueProblem[] = [
  {
    id: "1",
    severity: "critical",
    title: "Mobile checkout abandonment rate spiked 34%",
    description: "Users are dropping off during the payment step on mobile devices. Payment form fields are not optimized for mobile keyboards.",
    estimatedImpact: "~$12,400/mo",
    estimatedValue: "$12,400",
  },
  {
    id: "2",
    severity: "high",
    title: "Product page images loading slowly",
    description: "Average product page load time is 4.2s. Each second of delay reduces conversion by approximately 7%.",
    estimatedImpact: "~$8,200/mo",
    estimatedValue: "$8,200",
  },
  {
    id: "3",
    severity: "medium",
    title: "Search results relevance declined",
    description: "Customers report not finding products they know exist. Search query 'summer dress' returns irrelevant results 40% of the time.",
    estimatedImpact: "~$4,600/mo",
    estimatedValue: "$4,600",
  },
];

function RevenueProblems({
  problems = defaultProblems,
  onInvestigate,
  className,
}: RevenueProblemsProps) {
  return (
    <Card padding="default" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#FFB800]" />
          <h2 className="text-lg font-semibold text-[#1A1A1A]">
            Revenue Problems
          </h2>
        </div>
        <span className="text-sm text-[#6B7280]">
          {problems.length} detected
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {problems.map((problem) => {
          const severity = severityConfig[problem.severity];
          return (
            <div
              key={problem.id}
              className="group flex flex-col gap-4 rounded-[14px] border border-[#E8ECF3] p-5 transition-all duration-200 hover:border-[#7C5CFC]/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={severity.variant} className="gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", severity.dotColor)} />
                    {severity.label}
                  </Badge>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">
                    {problem.title}
                  </h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {problem.description}
                </p>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-[#6B7280]">Estimated impact:</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {problem.estimatedImpact}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 group-hover:border-[#7C5CFC] group-hover:text-[#7C5CFC]"
                onClick={() => onInvestigate?.(problem.id)}
              >
                Investigate
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export { RevenueProblems, type RevenueProblem, type RevenueProblemsProps };
