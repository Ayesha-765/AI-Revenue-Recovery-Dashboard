import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface RevenueLeak {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedLoss: string;
  estimatedValue?: string;
}

const severityConfig = {
  critical: { label: "Critical", variant: "danger" as const, dotColor: "bg-[#FF5C5C]" },
  high: { label: "High", variant: "warning" as const, dotColor: "bg-[#FFB800]" },
  medium: { label: "Medium", variant: "info" as const, dotColor: "bg-[#4F8CFF]" },
  low: { label: "Low", variant: "secondary" as const, dotColor: "bg-[#6B7280]" },
};

interface RevenueLeakCardProps {
  title?: string;
  leaks?: RevenueLeak[];
  onInvestigate?: (id: string) => void;
  className?: string;
}

const defaultLeaks: RevenueLeak[] = [
  {
    id: "1",
    severity: "critical",
    title: "Checkout abandonment rate spiked 24%",
    description: "Users are abandoning checkout after entering shipping details. Missing express pay options on mobile.",
    estimatedLoss: "~$3,240/mo",
    estimatedValue: "$3,240",
  },
  {
    id: "2",
    severity: "high",
    title: "Refund rate increased by 3.2%",
    description: "Product quality complaints from recent batch. Refund costs impacting net revenue.",
    estimatedLoss: "~$2,100/mo",
    estimatedValue: "$2,100",
  },
  {
    id: "3",
    severity: "medium",
    title: "Discount overuse on email campaigns",
    description: "40% of recent orders used discount codes. Margin erosion detected across 3 campaigns.",
    estimatedLoss: "~$1,850/mo",
    estimatedValue: "$1,850",
  },
  {
    id: "4",
    severity: "medium",
    title: "Inventory stockouts on top sellers",
    description: "12 top products ran out of stock this month. Estimated lost sales from unavailable items.",
    estimatedLoss: "~$4,200/mo",
    estimatedValue: "$4,200",
  },
];

function RevenueLeakCard({
  title = "Revenue Leaks",
  leaks = defaultLeaks,
  onInvestigate,
  className,
}: RevenueLeakCardProps) {
  return (
    <Card padding="default" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#FFB800]" />
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
        </div>
        <span className="text-sm text-[#6B7280]">
          {leaks.length} detected
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {leaks.map((leak) => {
          const severity = severityConfig[leak.severity];
          return (
            <div
              key={leak.id}
              className="group flex flex-col gap-4 rounded-[14px] border border-[#E8ECF3] p-5 transition-all duration-200 hover:border-[#7C5CFC]/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={severity.variant} className="gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", severity.dotColor)} />
                    {severity.label}
                  </Badge>
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">
                    {leak.title}
                  </h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {leak.description}
                </p>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-[#6B7280]">Estimated loss:</span>
                  <span className="font-semibold text-[#FF5C5C]">
                    {leak.estimatedLoss}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 group-hover:border-[#7C5CFC] group-hover:text-[#7C5CFC]"
                onClick={() => onInvestigate?.(leak.id)}
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

export { RevenueLeakCard, type RevenueLeak, type RevenueLeakCardProps };
