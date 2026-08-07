"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  OrderStatCard,
  OrderStatusCard,
  OrderAnalyticsChart,
  OrderTable,
  OrderAlertCard,
  AIOrderInsightCard,
  ActivityTimeline,
  CustomerInsights,
  OrderDetailsDrawer,
  FilterDropdown,
  SearchBar,
} from "@/components/orders";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react";

function OrdersPage() {
  const [chartPeriod, setChartPeriod] = React.useState("weekly");
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const kpiStats = [
    {
      title: "Total Orders",
      value: "1,247",
      change: 12.5,
      changeLabel: "vs last month",
      icon: ShoppingCart,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "up" as const,
      previousValue: "1,108",
    },
    {
      title: "Completed Orders",
      value: "892",
      change: 8.2,
      changeLabel: "vs last month",
      icon: CheckCircle2,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      trend: "up" as const,
      previousValue: "824",
    },
    {
      title: "Pending Orders",
      value: "156",
      change: -3.4,
      changeLabel: "vs last month",
      icon: Clock,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "down" as const,
      previousValue: "162",
    },
    {
      title: "Cancelled Orders",
      value: "24",
      change: -15.2,
      changeLabel: "vs last month",
      icon: XCircle,
      iconColor: "text-[#FF5C5C]",
      iconBg: "bg-[#FF5C5C]/10",
      trend: "down" as const,
      previousValue: "28",
    },
  ];

  const statusCards = [
    {
      title: "Pending",
      count: 156,
      percentage: 12.5,
      color: "#FFB800",
      bgColor: "bg-[#FFB800]/10",
      icon: <Clock className="h-5 w-5 text-[#FFB800]" />,
    },
    {
      title: "Processing",
      count: 89,
      percentage: 7.1,
      color: "#4F8CFF",
      bgColor: "bg-[#4F8CFF]/10",
      icon: <Truck className="h-5 w-5 text-[#4F8CFF]" />,
    },
    {
      title: "Shipped",
      count: 234,
      percentage: 18.8,
      color: "#7C5CFC",
      bgColor: "bg-[#7C5CFC]/10",
      icon: <Truck className="h-5 w-5 text-[#7C5CFC]" />,
    },
    {
      title: "Delivered",
      count: 744,
      percentage: 59.6,
      color: "#00C48C",
      bgColor: "bg-[#00C48C]/10",
      icon: <CheckCircle2 className="h-5 w-5 text-[#00C48C]" />,
    },
    {
      title: "Cancelled",
      count: 24,
      percentage: 1.9,
      color: "#FF5C5C",
      bgColor: "bg-[#FF5C5C]/10",
      icon: <XCircle className="h-5 w-5 text-[#FF5C5C]" />,
    },
  ];

  const dailyData = [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 38 },
    { label: "Wed", value: 55 },
    { label: "Thu", value: 48 },
    { label: "Fri", value: 62 },
    { label: "Sat", value: 78 },
    { label: "Sun", value: 65 },
  ];

  const weeklyData = [
    { label: "W1", value: 285 },
    { label: "W2", value: 321 },
    { label: "W3", value: 298 },
    { label: "W4", value: 359 },
    { label: "W5", value: 412 },
    { label: "W6", value: 385 },
  ];

  const monthlyData = [
    { label: "Jan", value: 980 },
    { label: "Feb", value: 1120 },
    { label: "Mar", value: 1050 },
    { label: "Apr", value: 1280 },
    { label: "May", value: 1420 },
    { label: "Jun", value: 1560 },
  ];

  const chartDataMap: Record<string, typeof dailyData> = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  };

  const chartTabs = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            <Download className="h-4 w-4" />
            Export Orders
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat) => (
          <OrderStatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Order Status Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statusCards.map((status) => (
            <OrderStatusCard key={status.title} {...status} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Order Analytics</h2>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="w-full sm:w-64"
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onValueChange={setStatusFilter}
            />
          </div>
        </div>
        <Card padding="default">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <p className="text-sm text-[#6B7280]">Track your order volume over time</p>
            <div className="flex flex-wrap items-center gap-2">
              {chartTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setChartPeriod(tab.value)}
                  className={cn(
                    "rounded-[10px] px-4 py-2 text-sm font-medium transition-all duration-200",
                    chartPeriod === tab.value
                      ? "bg-[#74B9FF] text-white shadow-sm"
                      : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F1F5F9]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <OrderAnalyticsChart data={chartDataMap[chartPeriod]} height={300} />
        </Card>
      </section>

      <section>
        <OrderTable onViewOrder={setSelectedOrder} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <OrderAlertCard />
        <ActivityTimeline />
      </section>

      <section>
        <CustomerInsights />
      </section>

      <section>
        <AIOrderInsightCard />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <EmptyState
          icon={Inbox}
          title="No orders yet"
          description="Orders will appear here once customers start purchasing from your store."
          action={
            <Button variant="outline">View Documentation</Button>
          }
        />
        <EmptyState
          icon={Inbox}
          title="No AI insights available"
          description="We're analyzing your order data. Check back soon for AI-powered recommendations."
          action={
            <Button variant="outline">Learn More</Button>
          }
        />
      </section>

      <OrderDetailsDrawer
        order={selectedOrder ? undefined : undefined}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAction={() => {}}
      />
    </div>
  );
}

export { OrdersPage };
