"use client";

import * as React from "react";
import Link from "next/link";
import {
  WelcomeHeader,
  StatCard,
} from "@/components/dashboard";
import { DollarSign, ShoppingCart, Users, BarChart3, LucideIcon, Sparkles, Loader2, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchOrdersByStore } from "@/lib/supabase/orders";
import { fetchCustomersByStore } from "@/lib/supabase/customers";
import { fetchProductsByStore } from "@/lib/supabase/products";
import {
  fetchStoreMetrics,
  detectProblems,
  type DetectedProblem,
} from "@/lib/supabase/problems";
import { generateInsights, type Insight, type InsightPriority } from "@/app/actions/analyze-insights";
import { supabase } from "@/lib/supabase/client";

type DashboardStat = {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: "up" | "down" | "neutral";
  previousValue?: string;
};

const priorityConfig: Record<InsightPriority, { label: string; variant: "danger" | "warning" | "info" | "secondary" | "default"; dotColor: string }> = {
  critical: { label: "Critical", variant: "danger", dotColor: "bg-[#FF5C5C]" },
  high: { label: "High", variant: "warning", dotColor: "bg-[#FFB800]" },
  medium: { label: "Medium", variant: "info", dotColor: "bg-[#4F8CFF]" },
  low: { label: "Low", variant: "secondary", dotColor: "bg-[#6B7280]" },
};

function DashboardPage() {
  const [stats, setStats] = React.useState<DashboardStat[]>([
    {
      title: "Total Revenue",
      value: "$0",
      icon: DollarSign,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "neutral",
      previousValue: "—",
    },
    {
      title: "Total Orders",
      value: "0",
      icon: ShoppingCart,
      iconColor: "text-[#74B9FF]",
      iconBg: "bg-[#74B9FF]/10",
      trend: "neutral",
      previousValue: "—",
    },
    {
      title: "Customers",
      value: "0",
      icon: Users,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      trend: "neutral",
      previousValue: "—",
    },
    {
      title: "Avg. Order Value",
      value: "$0",
      icon: BarChart3,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "neutral",
      previousValue: "—",
    },
  ]);
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [problems, setProblems] = React.useState<DetectedProblem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [storeId, setStoreId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        console.log("[Dashboard] getSession result", { userId, sessionError });
        if (!userId || !mounted) return;

        const userStore = await fetchStoreByOwnerId(userId);
        console.log("[Dashboard] fetchStoreByOwnerId result", { storeId: userStore?.id, storeName: userStore?.name });
        if (!mounted || !userStore) return;

        setStoreId(userStore.id);

        const [orders, customers, products] = await Promise.all([
          fetchOrdersByStore(userStore.id),
          fetchCustomersByStore(userStore.id),
          fetchProductsByStore(userStore.id),
        ]);
        console.log("[Dashboard] fetched data", { ordersCount: orders.length, customersCount: customers.length, orderTotals: orders.map((o) => ({ id: o.id, total: o.total, createdAt: o.createdAt })) });

        if (!mounted) return;

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const currentMonthOrders = orders.filter((o) => new Date(o.createdAt) >= currentMonthStart);
        const lastMonthOrders = orders.filter((o) => {
          const d = new Date(o.createdAt);
          return d >= lastMonthStart && d <= lastMonthEnd;
        });

        const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
        const lastRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
        const currentOrderCount = currentMonthOrders.length;
        const lastOrderCount = lastMonthOrders.length;

        const currentMonthCustomers = customers.filter((c) => new Date(c.createdAt) >= currentMonthStart);
        const lastMonthCustomers = customers.filter((c) => {
          const d = new Date(c.createdAt);
          return d >= lastMonthStart && d <= lastMonthEnd;
        });
        const currentCustomerCount = currentMonthCustomers.length;
        const lastCustomerCount = lastMonthCustomers.length;

        const avgOrderValueCurrent = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;
        const avgOrderValueLast = lastOrderCount > 0 ? lastRevenue / lastOrderCount : 0;

        const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : undefined;
        const orderChange = lastOrderCount > 0 ? ((currentOrderCount - lastOrderCount) / lastOrderCount) * 100 : undefined;
        const customerChange = lastCustomerCount > 0 ? ((currentCustomerCount - lastCustomerCount) / lastCustomerCount) * 100 : undefined;
        const aovChange = avgOrderValueLast > 0 ? ((avgOrderValueCurrent - avgOrderValueLast) / avgOrderValueLast) * 100 : undefined;

        const trend = (change: number | undefined) => {
          if (change === undefined) return "neutral" as const;
          if (change > 0) return "up" as const;
          if (change < 0) return "down" as const;
          return "neutral" as const;
        };

        const fmtMoney = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        console.log("[Dashboard] fetched data", { ordersCount: orders.length, customersCount: customers.length, totalRevenue, totalOrders, totalCustomers, avgOrderValue });

        setStats([
          {
            title: "Total Revenue",
            value: `$${fmtMoney(totalRevenue)}`,
            ...(revenueChange !== undefined ? { change: revenueChange, changeLabel: "vs last month", trend: trend(revenueChange), previousValue: `$${fmtMoney(lastRevenue)}` } : { previousValue: "—" }),
            icon: DollarSign,
            iconColor: "text-[#7C5CFC]",
            iconBg: "bg-[#7C5CFC]/10",
          },
          {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            ...(orderChange !== undefined ? { change: orderChange, changeLabel: "vs last month", trend: trend(orderChange), previousValue: lastOrderCount.toLocaleString() } : { previousValue: "—" }),
            icon: ShoppingCart,
            iconColor: "text-[#74B9FF]",
            iconBg: "bg-[#74B9FF]/10",
          },
          {
            title: "Customers",
            value: totalCustomers.toLocaleString(),
            ...(customerChange !== undefined ? { change: customerChange, changeLabel: "vs last month", trend: trend(customerChange), previousValue: lastCustomerCount.toLocaleString() } : { previousValue: "—" }),
            icon: Users,
            iconColor: "text-[#00C48C]",
            iconBg: "bg-[#00C48C]/10",
          },
          {
            title: "Avg. Order Value",
            value: `$${fmtMoney(avgOrderValue)}`,
            ...(aovChange !== undefined ? { change: aovChange, changeLabel: "vs last month", trend: trend(aovChange), previousValue: `$${fmtMoney(avgOrderValueLast)}` } : { previousValue: "—" }),
            icon: BarChart3,
            iconColor: "text-[#FFB800]",
            iconBg: "bg-[#FFB800]/10",
          },
        ]);

        const rangeDays = 30;
        const mappedProducts = products.map((p) => ({ id: p.id, name: p.name, stock: p.stock }));
        console.log("[Dashboard] fetchStoreMetrics input", { storeId: userStore.id, rangeDays });
        const metrics = await fetchStoreMetrics(userStore.id, rangeDays);
        const detected = detectProblems(metrics, mappedProducts);
        setProblems(detected);
      } catch (error) {
        console.error("[Dashboard] Error loading dashboard data:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const handleGenerateInsights = async () => {
    if (!storeId || problems.length === 0) return;

    setIsAnalyzing(true);
    try {
      const generated = await generateInsights(problems, storeId);
      setInsights(generated);
    } catch {
      setInsights([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await handleGenerateInsights();
  };

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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Welcome to your AI Revenue dashboard.
          </p>
        </div>
        <EmptyState
          icon={Inbox}
          title="No store found"
          description="You need to create a store before viewing your dashboard."
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

  const topInsight = insights.length > 0 ? insights[0] : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <WelcomeHeader />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          >
            Export Report
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">AI Revenue Insights</h2>
          <div className="flex items-center gap-2">
            {problems.length > 0 && (
              <button
                onClick={handleGenerateInsights}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 rounded-[14px] border border-[#7C5CFC] bg-[#7C5CFC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6B5DFF] disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {insights.length > 0 ? "Regenerate" : "Generate"} Insights
                  </>
                )}
              </button>
            )}
            <Link
              href="/dashboard/insights"
              className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
            >
              View All Insights
            </Link>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7C5CFC]" />
              <p className="mt-3 text-sm text-[#6B7280]">
                AI is analyzing your store data and generating insights...
              </p>
            </div>
          </div>
        )}

        {!isAnalyzing && !topInsight && (
          <div className="mt-6">
            <EmptyState
              icon={Sparkles}
              title={problems.length === 0 ? "No revenue problems detected" : "No insights generated yet"}
              description={
                problems.length === 0
                  ? "Your store is running smoothly. We'll surface AI insights as issues emerge."
                  : "Click 'Generate Insights' to have AI analyze your detected problems."
              }
              action={
                problems.length > 0 ? undefined : (
                  <Link
                    href="/dashboard/problems"
                    className="inline-flex items-center justify-center rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
                  >
                    View Revenue Problems
                  </Link>
                )
              }
            />
          </div>
        )}

        {!isAnalyzing && topInsight && (
          <div className="mt-6">
            <div className="rounded-[14px] border border-[#7C5CFC]/20 bg-gradient-to-br from-white to-[#7C5CFC]/5 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC] shadow-sm">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                  <Badge variant={priorityConfig[topInsight.priority].variant} className="gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${priorityConfig[topInsight.priority].dotColor}`}></span>
                    {priorityConfig[topInsight.priority].label}
                  </Badge>
                  </div>
                </div>
              </div>

              <h3 className="mt-4 text-xl font-bold text-[#1A1A1A] tracking-tight">
                {topInsight.title}
              </h3>

              <p className="mt-2 text-sm text-[#6B7280] leading-relaxed max-w-2xl">
                {topInsight.summary}
              </p>

              <div className="mt-4 rounded-[10px] bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs text-[#6B7280]">Impact</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">{topInsight.impact}</p>
              </div>

              <p className="mt-3 text-sm text-[#6B7280]">
                <span className="font-medium">Recommendation:</span> {topInsight.recommendation}
              </p>
            </div>
          </div>
        )}

        {insights.length > 0 && (
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/insights"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#7C5CFC] hover:underline"
            >
              View all {insights.length} insights
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export { DashboardPage };
