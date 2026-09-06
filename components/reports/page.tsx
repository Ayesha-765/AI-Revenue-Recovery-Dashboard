"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RevenueTrendChart } from "@/components/revenue/revenue-trend-chart";
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  RefreshCw,
  Download,
  Loader2,
  Inbox,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchOrdersByStore, type Order } from "@/lib/supabase/orders";
import { fetchProductsByStore, type DashboardProduct } from "@/lib/supabase/products";
import { fetchCustomersByStore, type Customer } from "@/lib/supabase/customers";
import { supabase } from "@/lib/supabase/client";
import { formatCurrency, formatPercentage } from "@/lib/supabase/problems";

type ChartPeriod = "daily" | "weekly" | "monthly";

interface RevenueDataItem {
  label: string;
  value: number;
}

interface ProductSales {
  productId: string;
  productName: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
}

function ReportsPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [products, setProducts] = React.useState<DashboardProduct[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [storeId, setStoreId] = React.useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = React.useState<ChartPeriod>("weekly");

  const loadReportData = React.useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      if (!userId) return;

      const userStore = await fetchStoreByOwnerId(userId);
      if (!userStore) return;

      setStoreId(userStore.id);
      const [dbOrders, dbProducts, dbCustomers] = await Promise.all([
        fetchOrdersByStore(userStore.id),
        fetchProductsByStore(userStore.id),
        fetchCustomersByStore(userStore.id),
      ]);

      setOrders(dbOrders);
      setProducts(dbProducts);
      setCustomers(dbCustomers);
      setError(null);
    } catch {
      setError("Failed to load report data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const now = new Date();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const currentMonthOrders = orders.filter(
    (o) => new Date(o.createdAt) >= currentMonthStart
  );
  const lastMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d >= lastMonthStart && d <= lastMonthEnd;
  });

  const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const revenueChange = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
  const ordersChange = lastMonthOrders.length > 0 ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 : 0;

  const trend = (change: number) => {
    if (change > 0) return "up" as const;
    if (change < 0) return "down" as const;
    return "neutral" as const;
  };

  const kpiStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: revenueChange,
      changeLabel: "vs last month",
      trend: trend(revenueChange),
      previousValue: formatCurrency(lastMonthRevenue),
      icon: DollarSign,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      changeLabel: "vs last month",
      trend: trend(ordersChange),
      previousValue: lastMonthOrders.length.toLocaleString(),
      icon: ShoppingCart,
      iconColor: "text-[#4F8CFF]",
      iconBg: "bg-[#4F8CFF]/10",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(averageOrderValue),
      changeLabel: "all time",
      trend: "neutral" as const,
      icon: TrendingUp,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
      previousValue: "—",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      changeLabel: "all time",
      trend: "neutral" as const,
      icon: Users,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      previousValue: "—",
    },
  ];

  const revenueChartData = React.useMemo<RevenueDataItem[]>(() => {
    if (orders.length === 0) {
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

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
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
        data[index] += order.total;
      }
    });

    return labels.map((label, i) => ({ label, value: Math.round(data[i]) }));
  }, [orders, chartPeriod]);

  const productSales = React.useMemo<ProductSales[]>(() => {
    const salesMap = new Map<string, ProductSales>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        const productName = item.productName || product?.name || "Unknown Product";
        const imageUrl = product?.imageUrl || "";

        if (!salesMap.has(item.productId)) {
          salesMap.set(item.productId, {
            productId: item.productId,
            productName,
            imageUrl,
            unitsSold: 0,
            revenue: 0,
          });
        }

        const existing = salesMap.get(item.productId)!;
        existing.unitsSold += item.quantity;
        existing.revenue += item.subtotal;
      });
    });

    return Array.from(salesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders, products]);

  const topCustomers = React.useMemo<Customer[]>(() => {
    return [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }, [customers]);

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return { label: "Delivered", variant: "success" as const, icon: CheckCircle2, color: "text-[#00C48C]", bg: "bg-[#00C48C]/10" };
      case "pending":
        return { label: "Pending", variant: "warning" as const, icon: Clock, color: "text-[#FFB800]", bg: "bg-[#FFB800]/10" };
      case "processing":
        return { label: "Processing", variant: "info" as const, icon: Truck, color: "text-[#4F8CFF]", bg: "bg-[#4F8CFF]/10" };
      case "shipped":
        return { label: "Shipped", variant: "info" as const, icon: Truck, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10" };
      case "cancelled":
        return { label: "Cancelled", variant: "danger" as const, icon: XCircle, color: "text-[#FF5C5C]", bg: "bg-[#FF5C5C]/10" };
      default:
        return { label: status, variant: "secondary" as const, icon: Package, color: "text-[#6B7280]", bg: "bg-[#6B7280]/10" };
    }
  };

  const handleExport = () => {
    if (orders.length === 0) return;

    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Revenue", formatCurrency(totalRevenue)],
      ["Total Orders", totalOrders.toString()],
      ["Avg. Order Value", formatCurrency(averageOrderValue)],
      ["Total Customers", totalCustomers.toString()],
      ["Total Products", totalProducts.toString()],
    ];

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.csv";
    a.click();
    URL.revokeObjectURL(url);
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            View detailed reports on your store's performance, sales trends, and key metrics.
          </p>
        </div>
        <EmptyState
          icon={Inbox}
          title="No store found"
          description="You need to create a store before viewing reports. Go to the Store page to get started."
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            View detailed reports on your store's performance, sales trends, and key metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setIsLoading(true); loadReportData(); }}
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
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
          <button
            onClick={() => { setIsLoading(true); loadReportData(); }}
            className="ml-3 inline-flex items-center gap-1 text-xs font-medium underline"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat) => (
          <Card key={stat.title} hoverable padding="default" className="group relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#6B7280]">{stat.title}</p>
                <p className="text-3xl font-bold text-[#1A1A1A] tracking-tight">{stat.value}</p>
                {stat.previousValue && (
                  <p className="text-xs text-[#6B7280]">Previous: {stat.previousValue}</p>
                )}
              </div>
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-[14px]", stat.iconBg)}>
                <stat.icon className={cn("h-7 w-7", stat.iconColor)} />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Revenue Trend</h2>
          <div className="flex items-center gap-2">
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
        <Card padding="default">
          {revenueChartData.length > 0 ? (
            <RevenueTrendChart data={revenueChartData} height={300} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-[#6B7280]">No revenue data available yet.</p>
            </div>
          )}
        </Card>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Top Products by Revenue</h2>
          <Card padding="none" className="overflow-hidden">
            {productSales.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-[#6B7280]">No product sales data available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E8ECF3]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8ECF3]">
                    {productSales.map((ps) => (
                      <tr key={ps.productId} className="group transition-colors duration-200 hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={ps.imageUrl}
                              alt={ps.productName}
                              size="sm"
                              fallback={ps.productName.charAt(0)}
                            />
                            <span className="text-sm font-medium text-[#1A1A1A]">{ps.productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                          {ps.unitsSold}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-[#1A1A1A]">
                          {formatCurrency(ps.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Order Status Breakdown</h2>
          <Card padding="none" className="overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-[#6B7280]">No order data available yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8ECF3]">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const config = getStatusConfig(status);
                  const percentage = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : "0";
                  return (
                    <div key={status} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-[12px]", config.bg)}>
                          <config.icon className={cn("h-5 w-5", config.color)} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{config.label}</p>
                          <p className="text-xs text-[#6B7280]">{percentage}% of orders</p>
                        </div>
                      </div>
                      <Badge variant={config.variant}>{count} orders</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Top Customers by Spend</h2>
        <Card padding="none" className="overflow-hidden">
          {topCustomers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-[#6B7280]">No customer data available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8ECF3]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8ECF3]">
                  {topCustomers.map((customer) => {
                    const initials = customer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <tr key={customer.id} className="group transition-colors duration-200 hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src=""
                              alt={customer.fullName}
                              fallback={initials}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">{customer.fullName}</p>
                              <p className="text-xs text-[#6B7280]">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                          {customer.totalOrders}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-[#1A1A1A]">
                          {formatCurrency(customer.totalSpent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

export { ReportsPage };
