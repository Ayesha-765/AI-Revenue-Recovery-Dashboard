import * as React from "react";
import { Card } from "@/components/ui/card";
import { Users, UserPlus, TrendingUp } from "lucide-react";

interface CustomerInsightsProps {
  returningCustomers?: number;
  firstTimeBuyers?: number;
  averageOrderValue?: string;
  repeatPurchaseRate?: string;
  className?: string;
}

function CustomerInsights({
  returningCustomers,
  firstTimeBuyers,
  averageOrderValue = "N/A",
  repeatPurchaseRate,
  className,
}: CustomerInsightsProps) {
  const hasData = returningCustomers !== undefined && firstTimeBuyers !== undefined;

  return (
    <Card padding="default" className={className}>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">Customer Order Insights</h3>
      <p className="text-sm text-[#6B7280]">Understand your customer behavior</p>

      {!hasData ? (
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] mb-3">
            <Users className="h-6 w-6 text-[#6B7280]" />
          </div>
          <p className="text-sm font-medium text-[#1A1A1A]">Not enough data yet</p>
          <p className="text-xs text-[#6B7280] mt-1">Customer insights will appear after more orders.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[14px] bg-[#F8FAFC] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10">
                <Users className="h-5 w-5 text-[#7C5CFC]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Returning Customers</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{returningCustomers}%</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-[#E8ECF3] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7C5CFC] transition-all duration-500"
                style={{ width: `${returningCustomers}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#6B7280]">
              {returningCustomers}% of total orders
            </p>
          </div>

          <div className="rounded-[14px] bg-[#F8FAFC] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#00C48C]/10">
                <UserPlus className="h-5 w-5 text-[#00C48C]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">First-time Buyers</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{firstTimeBuyers}%</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-[#E8ECF3] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00C48C] transition-all duration-500"
                style={{ width: `${firstTimeBuyers}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#6B7280]">
              {firstTimeBuyers}% of total orders
            </p>
          </div>

          <div className="rounded-[14px] bg-[#F8FAFC] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#74B9FF]/10">
                <TrendingUp className="h-5 w-5 text-[#74B9FF]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Average Order Value</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{averageOrderValue}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] bg-[#F8FAFC] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFB800]/10">
                <Users className="h-5 w-5 text-[#FFB800]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Repeat Purchase Rate</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{repeatPurchaseRate ?? "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export { CustomerInsights, type CustomerInsightsProps };
