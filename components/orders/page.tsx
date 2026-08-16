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
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchOrdersByStore } from "@/lib/supabase/orders";
import type { Order } from "@/components/orders/order-table";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function OrdersPage() {
  const [chartPeriod, setChartPeriod] = React.useState("weekly");
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [storeId, setStoreId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      try {
        const { data: sessionData } = await supabase.auth.getUser();
        const userId = sessionData.user?.id;
        if (!userId || !mounted) return;

        const userStore = await fetchStoreByOwnerId(userId);
        if (!mounted || !userStore) return;

        setStoreId(userStore.id);
        const dbOrders = await fetchOrdersByStore(userStore.id);
        if (!mounted) return;

        const mappedOrders: Order[] = dbOrders.map((dbOrder) => ({
          id: dbOrder.id.slice(0, 8).toUpperCase(),
          customer: dbOrder.customerName,
          customerEmail: dbOrder.customerEmail,
          productCount: dbOrder.items.reduce((sum, item) => sum + item.quantity, 0),
          total: `$${dbOrder.total.toFixed(2)}`,
          paymentStatus: dbOrder.status === "pending" ? "pending" : "paid",
          fulfillmentStatus: dbOrder.status === "pending" ? "pending" : dbOrder.status as Order["fulfillmentStatus"],
          date: new Date(dbOrder.createdAt).toLocaleDateString(),
        }));

        if (mounted) {
          setOrders(mappedOrders);
        }
      } catch {
        if (mounted) {
          setError("Failed to load orders.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.fulfillmentStatus === "delivered").length;
  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === "pending").length;
  const cancelledOrders = orders.filter((o) => o.fulfillmentStatus === "cancelled").length;

  const kpiStats = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: totalOrders > 0 ? 12.5 : 0,
      changeLabel: "vs last month",
      icon: ShoppingCart,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: totalOrders > 0 ? ("up" as const) : ("neutral" as const),
      previousValue: totalOrders > 0 ? String(Math.max(0, totalOrders - 1)) : "0",
    },
    {
      title: "Completed Orders",
      value: completedOrders.toLocaleString(),
      change: completedOrders > 0 ? 8.2 : 0,
      changeLabel: "vs last month",
      icon: CheckCircle2,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      trend: completedOrders > 0 ? ("up" as const) : ("neutral" as const),
      previousValue: completedOrders > 0 ? String(Math.max(0, completedOrders - 1)) : "0",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      change: pendingOrders > 0 ? -3.4 : 0,
      changeLabel: "vs last month",
      icon: Clock,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: pendingOrders > 0 ? ("down" as const) : ("neutral" as const),
      previousValue: pendingOrders > 0 ? String(Math.max(0, pendingOrders - 1)) : "0",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders.toLocaleString(),
      change: cancelledOrders > 0 ? -15.2 : 0,
      changeLabel: "vs last month",
      icon: XCircle,
      iconColor: "text-[#FF5C5C]",
      iconBg: "bg-[#FF5C5C]/10",
      trend: cancelledOrders > 0 ? ("down" as const) : ("neutral" as const),
      previousValue: cancelledOrders > 0 ? String(Math.max(0, cancelledOrders - 1)) : "0",
    },
  ];

  const statusCards = [
    {
      title: "Pending",
      count: pendingOrders,
      percentage: totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0,
      color: "#FFB800",
      bgColor: "bg-[#FFB800]/10",
      icon: <Clock className="h-5 w-5 text-[#FFB800]" />,
    },
    {
      title: "Processing",
      count: orders.filter((o) => o.fulfillmentStatus === "processing").length,
      percentage: totalOrders > 0 ? (orders.filter((o) => o.fulfillmentStatus === "processing").length / totalOrders) * 100 : 0,
      color: "#4F8CFF",
      bgColor: "bg-[#4F8CFF]/10",
      icon: <Truck className="h-5 w-5 text-[#4F8CFF]" />,
    },
    {
      title: "Shipped",
      count: orders.filter((o) => o.fulfillmentStatus === "shipped").length,
      percentage: totalOrders > 0 ? (orders.filter((o) => o.fulfillmentStatus === "shipped").length / totalOrders) * 100 : 0,
      color: "#7C5CFC",
      bgColor: "bg-[#7C5CFC]/10",
      icon: <Truck className="h-5 w-5 text-[#7C5CFC]" />,
    },
    {
      title: "Delivered",
      count: completedOrders,
      percentage: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      color: "#00C48C",
      bgColor: "bg-[#00C48C]/10",
      icon: <CheckCircle2 className="h-5 w-5 text-[#00C48C]" />,
    },
    {
      title: "Cancelled",
      count: cancelledOrders,
      percentage: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.
          </p>
        </div>
        <EmptyState
          icon={Inbox}
          title="No store found"
          description="You need to create a store before viewing orders. Go to the Store page to get started."
          action={
            <a
              href="/dashboard/store"
              className="inline-flex items-center justify-center rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
            >
              Create Your Store
            </a>
          }
        />
      </div>
    );
  }

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

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
        </div>
      )}

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
        <OrderTable orders={orders} onViewOrder={setSelectedOrder} />
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
