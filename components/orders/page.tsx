"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  OrderStatCard,
  OrderStatusCard,
  OrderAnalyticsChart,
  OrderTable,
  OrderAlertCard,
  type OrderAlert,
  AIOrderInsightCard,
  ActivityTimeline,
  type ActivityItem,
  CustomerInsights,
  OrderDetailsDrawer,
  FilterDropdown,
  SearchBar,
} from "@/components/orders";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Inbox, Sparkles } from "lucide-react";
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
import { fetchOrdersByStore, fetchRevenueByStore, updateOrderStatus } from "@/lib/supabase/orders";
import type { Order } from "@/components/orders/order-table";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

type ChartPeriod = "daily" | "weekly" | "monthly";

function OrdersPage() {
  const [chartPeriod, setChartPeriod] = React.useState<ChartPeriod>("weekly");
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [allOrders, setAllOrders] = React.useState<Order[]>([]);
  const [dbOrders, setDbOrders] = React.useState<Awaited<ReturnType<typeof fetchOrdersByStore>>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showRecoveryPlan, setShowRecoveryPlan] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const orderTableRef = React.useRef<HTMLDivElement>(null);

  const handleInvestigate = React.useCallback(() => {
    setStatusFilter("pending");
    setSearchQuery("");
    setCurrentPage(1);
    orderTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleGeneratePlan = React.useCallback(() => {
    setShowRecoveryPlan(true);
    setCurrentPage(1);
    orderTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const [storeId, setStoreId] = React.useState<string | null>(null);

  const loadOrders = React.useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      if (!userId) return;

      const userStore = await fetchStoreByOwnerId(userId);
      if (!userStore) return;

      setStoreId(userStore.id);
      const dbOrders = await fetchOrdersByStore(userStore.id);

      const mappedOrders: Order[] = dbOrders.map((dbOrder) => {
        const fulfillmentStatus =
          dbOrder.status === "pending"
            ? "pending"
            : dbOrder.status === "confirmed"
            ? "processing"
            : dbOrder.status === "processing"
            ? "processing"
            : dbOrder.status === "shipped"
            ? "shipped"
            : dbOrder.status === "delivered"
            ? "delivered"
            : dbOrder.status === "cancelled"
            ? "cancelled"
            : "pending";

        return {
          id: dbOrder.id,
          customer: dbOrder.customerName,
          customerEmail: dbOrder.customerEmail,
          productCount: dbOrder.items.reduce((sum, item) => sum + item.quantity, 0),
          total: `$${dbOrder.total.toFixed(2)}`,
          paymentStatus: dbOrder.paymentStatus === "failed" ? "failed" : dbOrder.paymentStatus === "refunded" ? "refunded" : dbOrder.paymentStatus === "paid" ? "paid" : "pending",
          fulfillmentStatus: fulfillmentStatus as Order["fulfillmentStatus"],
          date: new Date(dbOrder.createdAt).toLocaleDateString(),
        };
      });

      setAllOrders(mappedOrders);
      setDbOrders(dbOrders);
      setError(null);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null);

  const handleInlineStatusUpdate = React.useCallback(async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    setUpdatingOrderId(null);
    if (result.success) {
      await loadOrders();
    } else {
      setActionMessage({ type: "error", text: result.error || "Failed to update order status." });
    }
  }, [loadOrders]);

  const handleProcessOrder = React.useCallback(async (orderId: string, currentStatus: string) => {
    let nextStatus: string | null = null;
    if (currentStatus === "pending" || currentStatus === "confirmed") nextStatus = "processing";
    else if (currentStatus === "processing") nextStatus = "shipped";
    else if (currentStatus === "shipped") nextStatus = "delivered";
    if (!nextStatus) {
      setActionMessage({ type: "error", text: `Order is already ${currentStatus}.` });
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);
    const result = await updateOrderStatus(orderId, nextStatus);
    setIsProcessing(false);

    if (result.success) {
      setActionMessage({ type: "success", text: `Order moved to "${nextStatus}".` });
      await loadOrders();
    } else {
      setActionMessage({ type: "error", text: result.error || "Failed to update order." });
    }
  }, [loadOrders]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = React.useMemo(() => {
    let result = allOrders;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query) ||
          order.total.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.fulfillmentStatus === statusFilter);
    }

    return result;
  }, [allOrders, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalOrders = allOrders.length;
  const completedOrders = allOrders.filter((o) => o.fulfillmentStatus === "delivered").length;
  const pendingOrders = allOrders.filter((o) => o.fulfillmentStatus === "pending").length;
  const cancelledOrders = allOrders.filter((o) => o.fulfillmentStatus === "cancelled").length;

  const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total.replace("$", "")), 0);
  const averageOrderValue = totalOrders > 0 ? `$${(totalRevenue / totalOrders).toFixed(2)}` : "$0.00";

  const processingOrders = allOrders.filter((o) => o.fulfillmentStatus === "processing").length;
  const shippedOrders = allOrders.filter((o) => o.fulfillmentStatus === "shipped").length;

  const kpiStats = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      changeLabel: "vs last month",
      icon: ShoppingCart,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Completed Orders",
      value: completedOrders.toLocaleString(),
      changeLabel: "vs last month",
      icon: CheckCircle2,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      changeLabel: "vs last month",
      icon: Clock,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders.toLocaleString(),
      changeLabel: "vs last month",
      icon: XCircle,
      iconColor: "text-[#FF5C5C]",
      iconBg: "bg-[#FF5C5C]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
  ];

  const statusCards = [
    {
      title: "Pending",
      count: pendingOrders,
      percentage: totalOrders > 0 ? Number(((pendingOrders / totalOrders) * 100).toFixed(1)) : 0,
      color: "#FFB800",
      bgColor: "bg-[#FFB800]/10",
      icon: <Clock className="h-5 w-5 text-[#FFB800]" />,
    },
    {
      title: "Processing",
      count: processingOrders,
      percentage: totalOrders > 0 ? Number(((processingOrders / totalOrders) * 100).toFixed(1)) : 0,
      color: "#4F8CFF",
      bgColor: "bg-[#4F8CFF]/10",
      icon: <Truck className="h-5 w-5 text-[#4F8CFF]" />,
    },
    {
      title: "Shipped",
      count: shippedOrders,
      percentage: totalOrders > 0 ? Number(((shippedOrders / totalOrders) * 100).toFixed(1)) : 0,
      color: "#7C5CFC",
      bgColor: "bg-[#7C5CFC]/10",
      icon: <Truck className="h-5 w-5 text-[#7C5CFC]" />,
    },
    {
      title: "Delivered",
      count: completedOrders,
      percentage: totalOrders > 0 ? Number(((completedOrders / totalOrders) * 100).toFixed(1)) : 0,
      color: "#00C48C",
      bgColor: "bg-[#00C48C]/10",
      icon: <CheckCircle2 className="h-5 w-5 text-[#00C48C]" />,
    },
    {
      title: "Cancelled",
      count: cancelledOrders,
      percentage: totalOrders > 0 ? Number(((cancelledOrders / totalOrders) * 100).toFixed(1)) : 0,
      color: "#FF5C5C",
      bgColor: "bg-[#FF5C5C]/10",
      icon: <XCircle className="h-5 w-5 text-[#FF5C5C]" />,
    },
  ];

  const orderAlerts = React.useMemo<OrderAlert[]>(() => {
    if (allOrders.length === 0) return [];
    const alerts: OrderAlert[] = [];

    if (cancelledOrders > 0) {
      const rate = (cancelledOrders / totalOrders) * 100;
      alerts.push({
        id: "cancellation-rate",
        priority: rate > 15 ? "critical" : rate > 5 ? "high" : "medium",
        title: `${cancelledOrders} orders cancelled`,
        description: `Cancellation rate is ${rate.toFixed(1)}% of total orders. Review cancellation reasons and fulfillment.`,
        estimatedImpact: `${cancelledOrders} orders lost`,
      });
    }

    const failedPayments = allOrders.filter((o) => o.paymentStatus === "failed").length;
    if (failedPayments > 0) {
      const rate = (failedPayments / totalOrders) * 100;
      alerts.push({
        id: "failed-payments",
        priority: rate > 10 ? "critical" : "high",
        title: `${failedPayments} failed payments`,
        description: `${rate.toFixed(1)}% of orders had failed payments. Check payment gateway configuration.`,
        estimatedImpact: `${failedPayments} lost sales`,
      });
    }

    const pendingRate = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0;
    if (pendingOrders > 0 && pendingRate > 30) {
      alerts.push({
        id: "pending-backlog",
        priority: pendingRate > 60 ? "high" : "medium",
        title: `${pendingOrders} orders awaiting processing`,
        description: `${pendingRate.toFixed(1)}% of orders are still pending. This may delay fulfillment.`,
        estimatedImpact: "Slow fulfillment",
      });
    }

    return alerts;
  }, [allOrders, cancelledOrders, totalOrders, pendingOrders]);

  const activityItems = React.useMemo<ActivityItem[]>(() => {
    if (allOrders.length === 0) return [];
    const items: ActivityItem[] = [];

    const recent = [...allOrders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    recent.forEach((order) => {
      let status: ActivityItem["status"] = "info";
      if (order.paymentStatus === "paid" && order.fulfillmentStatus === "delivered") status = "success";
      else if (order.paymentStatus === "failed" || order.fulfillmentStatus === "cancelled") status = "warning";
      else if (order.fulfillmentStatus === "pending") status = "pending";

      items.push({
        id: order.id,
        title: `Order ${order.id.slice(0, 8)} — ${order.fulfillmentStatus}`,
        description: `${order.customer} • ${order.total}`,
        timestamp: order.date,
        status,
        icon: status,
      });
    });

    return items;
  }, [allOrders]);

  const customerInsightsData = React.useMemo(() => {
    if (allOrders.length === 0) {
      return { returning: 0, firstTime: 0, repeatRate: "0%" };
    }
    const customerOrdersMap = new Map<string, number>();
    allOrders.forEach((o) => {
      const key = o.customerEmail || o.customer;
      customerOrdersMap.set(key, (customerOrdersMap.get(key) || 0) + 1);
    });
    const uniqueCustomers = customerOrdersMap.size;
    const returning = [...customerOrdersMap.values()].filter((count) => count > 1).length;
    const firstTime = uniqueCustomers - returning;
    const repeatRate = uniqueCustomers > 0 ? (returning / uniqueCustomers) * 100 : 0;
    return {
      returning: uniqueCustomers > 0 ? Math.round((returning / uniqueCustomers) * 100) : 0,
      firstTime: uniqueCustomers > 0 ? Math.round((firstTime / uniqueCustomers) * 100) : 0,
      repeatRate: `${repeatRate.toFixed(1)}%`,
    };
  }, [allOrders]);

  const chartData = React.useMemo(() => {
    if (allOrders.length === 0) {
      return [];
    }

    const now = new Date();
    let labels: string[] = [];
    let groupBy: "day" | "week" | "month" = "week";

    if (chartPeriod === "daily") {
      groupBy = "day";
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else if (chartPeriod === "weekly") {
      groupBy = "week";
      const weeks = [];
      for (let i = 5; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() - i * 7);
        weeks.push(`W${6 - i}`);
      }
      labels = weeks;
    } else {
      groupBy = "month";
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    }

    const data = new Array(labels.length).fill(0);

    allOrders.forEach((order) => {
      const orderDate = new Date(order.date);
      let index = -1;

      if (groupBy === "day") {
        const dayIndex = (orderDate.getDay() + 6) % 7;
        index = dayIndex;
      } else if (groupBy === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const diffTime = orderDate.getTime() - weekStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diffDays / 7);
        const adjustedIndex = 5 - weekIndex;
        if (adjustedIndex >= 0 && adjustedIndex < labels.length) {
          index = adjustedIndex;
        }
      } else {
        const monthIndex = orderDate.getMonth();
        if (monthIndex < labels.length) {
          index = monthIndex;
        }
      }

      if (index >= 0 && index < data.length) {
        data[index] += 1;
      }
    });

    return labels.map((label, i) => ({ label, value: data[i] }));
  }, [allOrders, chartPeriod]);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadOrders();
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) return;

    const headers = ["Order ID", "Customer", "Email", "Items", "Total", "Payment", "Fulfillment", "Date"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.customer,
      o.customerEmail,
      o.productCount.toString(),
      o.total,
      o.paymentStatus,
      o.fulfillmentStatus,
      o.date,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedOrderDetail = React.useMemo(
    () => (selectedOrder ? dbOrders.find((o) => o.id === selectedOrder) ?? null : null),
    [selectedOrder, dbOrders]
  );

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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          >
            <Download className="h-4 w-4" />
            Export Orders
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
          <button
            onClick={handleRefresh}
            className="ml-3 inline-flex items-center gap-1 text-xs font-medium underline"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat) => (
          <OrderStatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Order Status Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              {(["daily", "weekly", "monthly"] as ChartPeriod[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setChartPeriod(tab)}
                  className={cn(
                    "rounded-[10px] px-4 py-2 text-sm font-medium transition-all duration-200 capitalize",
                    chartPeriod === tab
                      ? "bg-[#74B9FF] text-white shadow-sm"
                      : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F1F5F9]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <OrderAnalyticsChart data={chartData} height={300} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-[#6B7280]">No order data available yet.</p>
            </div>
          )}
        </Card>
      </section>

      <section ref={orderTableRef}>
        {showRecoveryPlan && (
          <Card padding="default" className="mb-4 border-[#7C5CFC]/20 bg-gradient-to-br from-white to-[#7C5CFC]/5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10">
                  <Sparkles className="h-5 w-5 text-[#7C5CFC]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A1A]">Recovery Plan</h3>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Prioritized actions to improve order performance:
                  </p>
                  <ol className="mt-3 space-y-2 text-sm text-[#1A1A1A]">
                    {cancelledOrders > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF5C5C]/10 text-xs font-medium text-[#FF5C5C]">1</span>
                        <span>Address {cancelledOrders} cancelled orders: contact affected customers with a win-back offer.</span>
                      </li>
                    )}
                    {pendingOrders > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFB800]/10 text-xs font-medium text-[#FFB800]">2</span>
                        <span>Process {pendingOrders} pending orders within 24 hours to avoid further delays.</span>
                      </li>
                    )}
                    {processingOrders > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4F8CFF]/10 text-xs font-medium text-[#4F8CFF]">3</span>
                        <span>Move {processingOrders} processing orders to shipped within 48 hours.</span>
                      </li>
                    )}
                    {shippedOrders > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-xs font-medium text-[#7C5CFC]">4</span>
                        <span>Follow up on {shippedOrders} shipped orders to confirm delivery.</span>
                      </li>
                    )}
                    {completedOrders > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00C48C]/10 text-xs font-medium text-[#00C48C]">5</span>
                        <span>Send review requests to {completedOrders} delivered customers.</span>
                      </li>
                    )}
                    {cancelledOrders === 0 && pendingOrders === 0 && processingOrders === 0 && shippedOrders === 0 && completedOrders === 0 && (
                      <li className="text-sm text-[#6B7280]">No actions required — your orders are on track.</li>
                    )}
                  </ol>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryPlan(false)}
                className="text-sm font-medium text-[#6B7280] hover:text-[#1A1A1A]"
                aria-label="Dismiss recovery plan"
              >
                Dismiss
              </button>
            </div>
          </Card>
        )}
        <OrderTable
          orders={paginatedOrders}
          onViewOrder={setSelectedOrder}
          onUpdateStatus={handleInlineStatusUpdate}
          updatingOrderId={updatingOrderId}
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalFiltered={filteredOrders.length}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <OrderAlertCard alerts={orderAlerts} />
        <ActivityTimeline items={activityItems} />
      </section>

      <section>
        <CustomerInsights
          returningCustomers={customerInsightsData.returning}
          firstTimeBuyers={customerInsightsData.firstTime}
          averageOrderValue={averageOrderValue}
          repeatPurchaseRate={customerInsightsData.repeatRate}
        />
      </section>

      <section>
        <AIOrderInsightCard
          title={allOrders.length > 0 ? "Order Performance Summary" : undefined}
          description={
            allOrders.length > 0
              ? `Analyzed ${totalOrders} orders. ${completedOrders} delivered, ${pendingOrders + processingOrders + shippedOrders} in progress, ${cancelledOrders} cancelled.`
              : undefined
          }
          estimatedImpact={
            cancelledOrders > 0
              ? `${cancelledOrders} orders at risk`
              : pendingOrders > 0
              ? `${pendingOrders} orders pending`
              : "All orders on track"
          }
          estimatedValue={allOrders.length > 0 ? `${averageOrderValue} avg order` : undefined}
          onInvestigate={handleInvestigate}
          onGeneratePlan={handleGeneratePlan}
          recommendedActions={
            allOrders.length > 0
              ? (() => {
                  const actions: string[] = [];
                  if (cancelledOrders > 0) {
                    actions.push(`Investigate why ${cancelledOrders} orders were cancelled`);
                  }
                  const failedPayments = allOrders.filter((o) => o.paymentStatus === "failed").length;
                  if (failedPayments > 0) {
                    actions.push(`Review ${failedPayments} failed payment transactions`);
                  }
                  if (pendingOrders > 0) {
                    actions.push(`Process ${pendingOrders} pending orders to speed fulfillment`);
                  }
                  if (processingOrders > 0) {
                    actions.push(`Update status on ${processingOrders} orders being processed`);
                  }
                  if (shippedOrders > 0) {
                    actions.push(`Track ${shippedOrders} shipped orders to delivery`);
                  }
                  if (completedOrders > 0) {
                    actions.push(`Engage ${completedOrders} delivered customers for reviews`);
                  }
                  if (actions.length === 0) {
                    actions.push("Continue monitoring order patterns");
                  }
                  return actions.slice(0, 4);
                })()
              : undefined
          }
        />
      </section>

      <OrderDetailsDrawer
        order={selectedOrderDetail ? (() => {
          const full = selectedOrderDetail;
          const address = [full.customerAddress, full.customerCity, full.customerPostalCode]
            .filter(Boolean)
            .join("\n") || "No shipping address on file";
          const phone = full.customerPhone || "—";
          const createdAt = new Date(full.createdAt);
          const timeline = [
            { status: "Order placed", date: createdAt.toLocaleString(), note: "Order was created" },
            ...(full.status !== "pending"
              ? [{ status: `Status: ${full.status}`, date: createdAt.toLocaleString(), note: `Order marked as ${full.status}` }]
              : []),
            ...(full.paymentStatus === "paid"
              ? [{ status: "Payment received", date: createdAt.toLocaleString(), note: "Payment confirmed" }]
              : []),
          ];
          return {
            id: full.id,
            customer: full.customerName,
            email: full.customerEmail,
            phone,
            products: full.items.map((item) => ({
              name: item.productName,
              quantity: item.quantity,
              price: `$${item.subtotal.toFixed(2)}`,
            })),
            shippingAddress: address,
            paymentMethod: full.paymentStatus === "paid" ? "Credit / Debit Card" : full.paymentStatus === "failed" ? "Payment Failed" : "Pending",
            paymentStatus: full.paymentStatus,
            fulfillmentStatus: full.status,
            timeline,
            notes: "No notes for this order.",
          };
        })() : undefined}
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setActionMessage(null);
        }}
        onAction={() => {
          if (selectedOrderDetail) {
            handleProcessOrder(selectedOrderDetail.id, selectedOrderDetail.status);
          }
        }}
        isProcessing={isProcessing}
        actionMessage={actionMessage}
      />
    </div>
  );
}

export { OrdersPage };
