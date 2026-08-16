"use client";

import * as React from "react";
import {
  WelcomeHeader,
  StatCard,
  RevenueProblems,
  AIRecommendation,
  RecentActivity,
} from "@/components/dashboard";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";

function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$48,352",
      change: 12.5,
      changeLabel: "vs last month",
      icon: DollarSign,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "up" as const,
    },
    {
      title: "Total Orders",
      value: "1,247",
      change: 8.2,
      changeLabel: "vs last month",
      icon: ShoppingCart,
      iconColor: "text-[#74B9FF]",
      iconBg: "bg-[#74B9FF]/10",
      trend: "up" as const,
    },
    {
      title: "Customers",
      value: "892",
      change: 4.1,
      changeLabel: "vs last month",
      icon: Users,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      trend: "up" as const,
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: -0.8,
      changeLabel: "vs last month",
      icon: TrendingUp,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "down" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WelcomeHeader />
        <div className="flex items-center gap-2">
          <button className="rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            Export Report
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueProblems />
        </div>
        <div>
          <RecentActivity />
        </div>
      </section>

      <section>
        <AIRecommendation />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <EmptyState
          icon={Inbox}
          title="No problems detected"
          description="Your store is running smoothly. We'll notify you if any revenue issues are detected."
          action={
            <Button variant="outline">View Past Problems</Button>
          }
        />
        <EmptyState
          icon={Inbox}
          title="No new recommendations"
          description="We're analyzing your store data. Check back soon for AI-powered insights."
          action={
            <Button variant="outline">Learn More</Button>
          }
        />
      </section>
    </div>
  );
}

export { DashboardPage };
