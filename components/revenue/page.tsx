"use client";

import * as React from "react";
import {
  SectionHeader,
  FilterTabs,
  RevenueCard,
  RevenueTrendChart,
  RevenueBreakdownCard,
  TopProductsTable,
  RevenueLeakCard,
  AIInsightCard,
  ForecastCard,
  TimelineCard,
} from "@/components/revenue";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  Inbox,
} from "lucide-react";

function RevenuePage() {
  const [chartPeriod, setChartPeriod] = React.useState("monthly");

  const kpiStats = [
    {
      title: "Total Revenue",
      value: "$142,350",
      change: 12.5,
      changeLabel: "vs last month",
      icon: DollarSign,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "up" as const,
      previousValue: "$126,500",
    },
    {
      title: "Net Revenue",
      value: "$128,420",
      change: 9.8,
      changeLabel: "vs last month",
      icon: Wallet,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      trend: "up" as const,
      previousValue: "$116,900",
    },
    {
      title: "Average Order Value",
      value: "$89.40",
      change: 4.2,
      changeLabel: "vs last month",
      icon: BarChart3,
      iconColor: "text-[#74B9FF]",
      iconBg: "bg-[#74B9FF]/10",
      trend: "up" as const,
      previousValue: "$85.80",
    },
    {
      title: "Revenue Growth",
      value: "18.5%",
      change: 2.3,
      changeLabel: "vs last month",
      icon: TrendingUp,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "up" as const,
    },
  ];

  const dailyData = [
    { label: "Mon", value: 4200 },
    { label: "Tue", value: 3800 },
    { label: "Wed", value: 5100 },
    { label: "Thu", value: 4600 },
    { label: "Fri", value: 5900 },
    { label: "Sat", value: 6200 },
    { label: "Sun", value: 5400 },
  ];

  const weeklyData = [
    { label: "W1", value: 28500 },
    { label: "W2", value: 32100 },
    { label: "W3", value: 29800 },
    { label: "W4", value: 35900 },
    { label: "W5", value: 41200 },
    { label: "W6", value: 38500 },
  ];

  const monthlyData = [
    { label: "Jan", value: 98000 },
    { label: "Feb", value: 112000 },
    { label: "Mar", value: 105000 },
    { label: "Apr", value: 128000 },
    { label: "May", value: 142000 },
    { label: "Jun", value: 156000 },
  ];

  const yearlyData = [
    { label: "2019", value: 520000 },
    { label: "2020", value: 680000 },
    { label: "2021", value: 850000 },
    { label: "2022", value: 1020000 },
    { label: "2023", value: 1280000 },
    { label: "2024", value: 1560000 },
  ];

  const chartDataMap: Record<string, typeof dailyData> = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
    yearly: yearlyData,
  };

  const chartTabs = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  const salesChannels = [
    { label: "Direct", value: "$48,200", percentage: 34, growth: 8.2, trend: "up" as const },
    { label: "Organic Search", value: "$38,500", percentage: 27, growth: 12.5, trend: "up" as const },
    { label: "Paid Ads", value: "$32,100", percentage: 23, growth: -2.4, trend: "down" as const },
    { label: "Social Media", value: "$18,750", percentage: 13, growth: 5.1, trend: "up" as const },
    { label: "Email", value: "$4,800", percentage: 3, growth: -0.8, trend: "neutral" as const },
  ];

  const products = [
    { label: "Electronics", value: "$52,300", percentage: 37, growth: 14.2, trend: "up" as const },
    { label: "Clothing", value: "$38,400", percentage: 27, growth: 6.8, trend: "up" as const },
    { label: "Home & Garden", value: "$28,100", percentage: 20, growth: -1.2, trend: "down" as const },
    { label: "Beauty", value: "$15,800", percentage: 11, growth: 22.5, trend: "up" as const },
    { label: "Sports", value: "$7,750", percentage: 5, growth: 3.1, trend: "up" as const },
  ];

  const categories = [
    { label: "New Arrivals", value: "$45,600", percentage: 32, growth: 18.4, trend: "up" as const },
    { label: "Best Sellers", value: "$52,300", percentage: 37, growth: 8.2, trend: "up" as const },
    { label: "Sale Items", value: "$28,100", percentage: 20, growth: -5.4, trend: "down" as const },
    { label: "Clearance", value: "$16,350", percentage: 11, growth: 2.1, trend: "up" as const },
  ];

  const countries = [
    { label: "United States", value: "$68,400", percentage: 48, growth: 10.5, trend: "up" as const },
    { label: "United Kingdom", value: "$24,200", percentage: 17, growth: 6.8, trend: "up" as const },
    { label: "Canada", value: "$18,600", percentage: 13, growth: 12.2, trend: "up" as const },
    { label: "Germany", value: "$14,300", percentage: 10, growth: -1.5, trend: "down" as const },
    { label: "Australia", value: "$9,850", percentage: 7, growth: 4.8, trend: "up" as const },
    { label: "Others", value: "$7,000", percentage: 5, growth: 2.3, trend: "up" as const },
  ];

  const devices = [
    { label: "Mobile", value: "$56,800", percentage: 40, growth: 15.2, trend: "up" as const },
    { label: "Desktop", value: "$62,400", percentage: 44, growth: 8.5, trend: "up" as const },
    { label: "Tablet", value: "$23,150", percentage: 16, growth: -2.8, trend: "down" as const },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Revenue Overview
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Monitor revenue performance, identify growth opportunities, and recover lost sales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat) => (
          <RevenueCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            title="Revenue Trend"
            description="Track your revenue performance over time"
          />
          <FilterTabs
            tabs={chartTabs}
            activeTab={chartPeriod}
            onTabChange={setChartPeriod}
          />
        </div>
        <Card padding="default">
          <RevenueTrendChart data={chartDataMap[chartPeriod]} height={300} />
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <RevenueBreakdownCard
          title="Sales Channel"
          description="Revenue by acquisition channel"
          items={salesChannels}
          icon={<BarChart3 className="h-5 w-5 text-[#7C5CFC]" />}
        />
        <RevenueBreakdownCard
          title="Products"
          description="Revenue by product category"
          items={products}
          icon={<TrendingUp className="h-5 w-5 text-[#00C48C]" />}
        />
        <RevenueBreakdownCard
          title="Categories"
          description="Revenue by product category"
          items={categories}
          icon={<BarChart3 className="h-5 w-5 text-[#74B9FF]" />}
        />
        <RevenueBreakdownCard
          title="Countries"
          description="Revenue by geographic region"
          items={countries}
          icon={<DollarSign className="h-5 w-5 text-[#FFB800]" />}
        />
        <RevenueBreakdownCard
          title="Devices"
          description="Revenue by device type"
          items={devices}
          icon={<TrendingUp className="h-5 w-5 text-[#4F8CFF]" />}
        />
      </section>

      <section>
        <TopProductsTable />
      </section>

      <section>
        <RevenueLeakCard />
      </section>

      <section>
        <AIInsightCard />
      </section>

      <section>
        <ForecastCard />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TimelineCard />
        <EmptyState
          icon={Inbox}
          title="No revenue data yet"
          description="Connect your store to start tracking revenue analytics and insights."
          action={
            <Button variant="outline">Connect Store</Button>
          }
        />
      </section>
    </div>
  );
}

export { RevenuePage };
