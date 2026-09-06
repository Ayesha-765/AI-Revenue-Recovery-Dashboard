"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, AlertTriangle, TrendingDown, TrendingUp, Minus, DollarSign, Package, Users } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/supabase/problems";
import type { DetectedProblem, ProblemSeverity } from "@/lib/supabase/problems";

interface ProblemDetailsDrawerProps {
  problem: DetectedProblem;
  isOpen: boolean;
  onClose: () => void;
}

const severityConfig: Record<ProblemSeverity, { label: string; variant: "danger" | "warning" | "info" }> = {
  critical: { label: "Critical", variant: "danger" },
  warning: { label: "Warning", variant: "warning" },
  info: { label: "Info", variant: "info" },
};

const problemTypeIcons: Record<string, React.ReactNode> = {
  revenue_drop: <DollarSign className="h-5 w-5 text-[#7C5CFC]" />,
  order_drop: <TrendingDown className="h-5 w-5 text-[#FF5C5C]" />,
  product_decline: <Package className="h-5 w-5 text-[#FFB800]" />,
  low_stock: <Package className="h-5 w-5 text-[#FF5C5C]" />,
  customer_inactivity: <Users className="h-5 w-5 text-[#4F8CFF]" />,
};

function ProblemDetailsDrawer({ problem, isOpen, onClose }: ProblemDetailsDrawerProps) {
  if (!isOpen) return null;

  const severity = severityConfig[problem.severity];
  const typeLabel = problem.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-[#00C48C]" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-[#FF5C5C]" />;
    return <Minus className="h-4 w-4 text-[#6B7280]" />;
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("fixed inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-[#E8ECF3] bg-white shadow-xl")}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Problem Details</h2>
              <p className="text-sm text-[#6B7280]">{typeLabel}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC]/10">
                {problemTypeIcons[problem.type] || <AlertTriangle className="h-6 w-6 text-[#7C5CFC]" />}
              </div>
              <div>
                <Badge variant={severity.variant} className="mb-1">
                  {severity.label}
                </Badge>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{problem.title}</h3>
              </div>
            </div>

            <Card padding="default">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Problem</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{problem.description}</p>
            </Card>

            <Card padding="default">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Evidence</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#6B7280]">Current Value</p>
                  <p className="text-lg font-bold text-[#1A1A1A]">
                    {formatCurrency(problem.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Previous Value</p>
                  <p className="text-lg font-bold text-[#1A1A1A]">
                    {formatCurrency(problem.previousValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Change</p>
                  <div className="flex items-center gap-1">
                    {getChangeIcon(problem.changePercentage)}
                    <span className="text-lg font-bold text-[#1A1A1A]">
                      {formatPercentage(problem.changePercentage)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Detected At</p>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {new Date(problem.detectedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {problem.estimatedImpact > 0 && (
              <Card padding="default">
                <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">Impact</h3>
                <div className="flex items-center gap-3 rounded-[14px] bg-[#FF5C5C]/5 px-4 py-3">
                  <DollarSign className="h-5 w-5 text-[#FF5C5C]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Estimated revenue at risk</p>
                    <p className="text-lg font-bold text-[#FF5C5C]">{formatCurrency(problem.estimatedImpact)}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card padding="default">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">Why It Matters</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {problem.type === "revenue_drop" &&
                  "A significant revenue decline can indicate issues with product demand, checkout friction, or market conditions. Addressing this early can prevent further losses."}
                {problem.type === "order_drop" &&
                  "Declining order volume suggests reduced customer interest or conversion issues. Investigating the root cause can help restore growth."}
                {problem.type === "product_decline" &&
                  "Products with declining sales may need repositioning, better marketing, or inventory adjustments to regain traction."}
                {problem.type === "low_stock" &&
                  "Out-of-stock or low-stock products directly impact revenue by preventing purchases. Restocking promptly avoids lost sales."}
                {problem.type === "customer_inactivity" &&
                  "Customer churn directly impacts recurring revenue. Re-engaging inactive customers is more cost-effective than acquiring new ones."}
              </p>
            </Card>

            <Card padding="default">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">Recommended Next Step</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {problem.type === "revenue_drop" &&
                  "Review recent order trends, top-performing products, and checkout performance. Check for any recent changes in marketing, pricing, or product availability."}
                {problem.type === "order_drop" &&
                  "Check marketing campaigns, product availability, and checkout flow. Consider running a promotion or reviewing the customer journey for friction points."}
                {problem.type === "product_decline" &&
                  "Review product pricing, inventory levels, and customer feedback. Consider updating product descriptions, images, or running targeted promotions."}
                {problem.type === "low_stock" &&
                  "Review inventory and restock the affected product. Check supplier lead times and consider setting up low-stock alerts."}
                {problem.type === "customer_inactivity" &&
                  "Launch a re-engagement campaign or review the customer experience. Consider win-back emails, loyalty programs, or special offers."}
              </p>
            </Card>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProblemDetailsDrawer, type ProblemDetailsDrawerProps };
