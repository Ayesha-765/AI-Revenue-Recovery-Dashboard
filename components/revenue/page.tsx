"use client";

import * as React from "react";
import Link from "next/link";
import {
  SectionHeader,
  FilterTabs,
  RevenueCard,
  RevenueTrendChart,
  RevenueBreakdownCard,
} from "@/components/revenue";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  Inbox,
  Sparkles,
} from "lucide-react";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchOrdersByStore } from "@/lib/supabase/orders";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function RevenuePage() {
  const [chartPeriod, setChartPeriod] = React.useState("monthly");
  const [orders, setOrders] = React.useState<Awaited<ReturnType<typeof fetchOrdersByStore>>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [storeId, setStoreId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadRevenue() {
      try {
        const { data: sessionData } = await supabase.auth.getUser();
        const userId = sessionData.user?.id;
        if (!userId || !mounted) return;

        const userStore = await fetchStoreByOwnerId(userId);
        if (!mounted || !userStore) return;

        setStoreId(userStore.id);
        const storeOrders = await fetchOrdersByStore(userStore.id);
        if (mounted) {
          setOrders(storeOrders);
        }
      } catch {
        if (mounted) {
          setError("Failed to load revenue data.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadRevenue();

    return () => {
      mounted = false;
    };
  }, []);

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const currentMonthOrders = orders.filter((o) => new Date(o.createdAt) >= currentMonthStart);
  const lastMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d >= lastMonthStart && d <= lastMonthEnd;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const lastRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const netRevenue = totalRevenue;
  const avgOrderValue = currentMonthOrders.length > 0 ? currentRevenue / currentMonthOrders.length : 0;
  const lastAvgOrderValue = lastMonthOrders.length > 0 ? lastRevenue / lastMonthOrders.length : 0;

  const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
  const netChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
  const aovChange = lastAvgOrderValue > 0 ? ((avgOrderValue - lastAvgOrderValue) / lastAvgOrderValue) * 100 : 0;
  const revenueGrowth = lastRevenue > 0 ? ((totalRevenue - lastRevenue) / lastRevenue) * 100 : totalRevenue > 0 ? 100 : 0;

  const trend = (change: number) => {
    if (change > 0) return "up" as const;
    if (change < 0) return "down" as const;
    return "neutral" as const;
  };

  const kpiStats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ...(lastRevenue > 0 ? { change: revenueChange, changeLabel: "vs last month", trend: trend(revenueChange), previousValue: `$${lastRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` } : { previousValue: "—" }),
      icon: DollarSign,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
    },
    {
      title: "Net Revenue",
      value: `$${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ...(lastRevenue > 0 ? { change: netChange, changeLabel: "vs last month", trend: trend(netChange), previousValue: `$${lastRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` } : { previousValue: "—" }),
      icon: Wallet,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
    },
    {
      title: "Average Order Value",
      value: `$${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ...(lastAvgOrderValue > 0 ? { change: aovChange, changeLabel: "vs last month", trend: trend(aovChange), previousValue: `$${lastAvgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` } : { previousValue: "—" }),
      icon: BarChart3,
      iconColor: "text-[#74B9FF]",
      iconBg: "bg-[#74B9FF]/10",
    },
    {
      title: "Revenue Growth",
      value: totalRevenue > 0 ? `${revenueGrowth.toFixed(1)}%` : "0%",
      ...(lastRevenue > 0 ? { change: revenueGrowth, changeLabel: "vs last month", trend: trend(revenueGrowth) } : {}),
      icon: TrendingUp,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
    },
  ];

  const generateChartData = React.useCallback(
    (period: string) => {
      if (orders.length === 0) {
        return [];
      }

      if (period === "daily") {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const data: { label: string; value: number }[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dayStart = new Date(now.getFullYear(), now.getMonth(), day);
          const dayEnd = new Date(now.getFullYear(), now.getMonth(), day, 23, 59, 59, 999);
          if (dayStart > now) break;
          const dayRevenue = orders
            .filter((o) => {
              const d = new Date(o.createdAt);
              return d >= dayStart && d <= dayEnd;
            })
            .reduce((sum, o) => sum + o.total, 0);
          data.push({ label: day.toString(), value: dayRevenue });
        }
        return data;
      }

      if (period === "weekly") {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const weeks: { label: string; value: number }[] = [];
        for (let week = 1; week <= 52; week++) {
          const weekStart = new Date(yearStart);
          weekStart.setDate(yearStart.getDate() + (week - 1) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          if (weekStart > now) break;
          const weekRevenue = orders
            .filter((o) => {
              const d = new Date(o.createdAt);
              return d >= weekStart && d <= weekEnd;
            })
            .reduce((sum, o) => sum + o.total, 0);
          weeks.push({ label: `W${week}`, value: weekRevenue });
        }
        return weeks;
      }

      if (period === "monthly") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const data: { label: string; value: number }[] = [];
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(now.getFullYear(), month, 1);
          const monthEnd = new Date(now.getFullYear(), month + 1, 0, 23, 59, 59, 999);
          if (monthStart > now) break;
          const monthRevenue = orders
            .filter((o) => {
              const d = new Date(o.createdAt);
              return d >= monthStart && d <= monthEnd;
            })
            .reduce((sum, o) => sum + o.total, 0);
          data.push({ label: months[month], value: monthRevenue });
        }
        return data;
      }

      if (period === "yearly") {
        const data: { label: string; value: number }[] = [];
        for (let year = now.getFullYear() - 5; year <= now.getFullYear(); year++) {
          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);
          const yearRevenue = orders
            .filter((o) => {
              const d = new Date(o.createdAt);
              return d >= yearStart && d <= yearEnd;
            })
            .reduce((sum, o) => sum + o.total, 0);
          data.push({ label: year.toString(), value: yearRevenue });
        }
        return data;
      }

      return [];
    },
    [orders, now]
  );

  const chartData = generateChartData(chartPeriod);

  const productRevenue = React.useMemo(() => {
    const revenue = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        const current = revenue.get(item.productName) || 0;
        revenue.set(item.productName, current + item.subtotal);
      }
    }
    const total = Array.from(revenue.values()).reduce((sum, v) => sum + v, 0);
    return Array.from(revenue.entries())
      .map(([label, value]) => ({
        label,
        value: `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        percentage: total > 0 ? (value / total) * 100 : 0,
        trend: "neutral" as const,
      }))
      .sort((a, b) => {
        const aVal = parseFloat(a.value.replace(/[$,]/g, ""));
        const bVal = parseFloat(b.value.replace(/[$,]/g, ""));
        return bVal - aVal;
      });
  }, [orders]);

  const chartTabs = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Revenue Overview</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Monitor revenue performance, identify growth opportunities, and recover lost sales.
          </p>
        </div>
        <EmptyState
          icon={Inbox}
          title="No store found"
          description="You need to create a store before viewing revenue. Go to the Store page to get started."
          action={
            <Link
              href="/dashboard/store"
              className="inline-flex items-center justify-center rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
            >
              Create Your Store
            </Link>
          }
        />
      </div>
    );
  }

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

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
        </div>
      )}

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
          {chartData.length > 0 ? (
            <RevenueTrendChart data={chartData} height={300} />
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No revenue data yet"
              description="Revenue trends will appear once you have order history."
            />
          )}
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <RevenueBreakdownCard
          title="Products"
          description="Revenue by product"
          items={productRevenue}
          icon={<TrendingUp className="h-5 w-5 text-[#00C48C]" />}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#7C5CFC]" />
            <h2 className="text-lg font-semibold text-[#1A1A1A]">AI Revenue Insights</h2>
          </div>
          <Link
            href="/dashboard/insights"
            className="inline-flex items-center gap-2 rounded-[14px] border border-[#7C5CFC] bg-[#7C5CFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6B5DFF]"
          >
            Open AI Insights
          </Link>
        </div>
        <Card padding="default">
          <EmptyState
            icon={Sparkles}
            title="AI analysis available"
            description="Visit AI Insights for detailed revenue intelligence, problem analysis, and actionable recommendations powered by AI."
          />
        </Card>
      </section>
    </div>
  );
}

export { RevenuePage };
