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
  returningCustomers = 68,
  firstTimeBuyers = 32,
  averageOrderValue = "$89.40",
  repeatPurchaseRate = "42%",
  className,
}: CustomerInsightsProps) {
  return (
    <Card padding="default" className={className}>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">Customer Order Insights</h3>
      <p className="text-sm text-[#6B7280]">Understand your customer behavior</p>

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
          <p className="mt-2 text-xs text-[#00C48C] font-medium">+4.2% vs last month</p>
        </div>

        <div className="rounded-[14px] bg-[#F8FAFC] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFB800]/10">
              <Users className="h-5 w-5 text-[#FFB800]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Repeat Purchase Rate</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{repeatPurchaseRate}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#00C48C] font-medium">+2.1% vs last month</p>
        </div>
      </div>
    </Card>
  );
}

export { CustomerInsights, type CustomerInsightsProps };
