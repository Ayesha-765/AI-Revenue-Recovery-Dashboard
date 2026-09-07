"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { SearchBar, FilterDropdown, Pagination } from "@/components/orders";
import { CustomerDetailsDrawer } from "@/components/customers/customer-details-drawer";
import { Inbox, Users, UserPlus, TrendingUp, RefreshCw, Download, Eye } from "lucide-react";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchCustomersByStore, type Customer } from "@/lib/supabase/customers";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

type CustomerStatus = "new" | "active" | "inactive";
type SortOption = "newest" | "highest_spending" | "most_orders";

function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [storeId, setStoreId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const loadCustomers = React.useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      if (!userId) return;

      const userStore = await fetchStoreByOwnerId(userId);
      if (!userStore) return;

      setStoreId(userStore.id);
      const dbCustomers = await fetchCustomersByStore(userStore.id);
      setCustomers(dbCustomers);
      setError(null);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const getCustomerStatus = (customer: Customer): CustomerStatus => {
    if (customer.totalOrders === 0) return "new";
    const lastOrder = customer.lastOrderAt ? new Date(customer.lastOrderAt) : null;
    if (lastOrder) {
      const daysSinceLastOrder = (Date.now() - lastOrder.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastOrder <= 30) return "active";
    }
    return "inactive";
  };

  const processedCustomers = React.useMemo(() => {
    let result = [...customers];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone?.toLowerCase().includes(query) ||
          c.address?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => getCustomerStatus(c) === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "highest_spending") {
        return b.totalSpent - a.totalSpent;
      }
      if (sortBy === "most_orders") {
        return b.totalOrders - a.totalOrders;
      }
      return 0;
    });

    return result;
  }, [customers, searchQuery, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedCustomers.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCustomers = processedCustomers.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const totalCustomers = customers.length;
  const newCustomers = customers.filter((c) => c.totalOrders === 0).length;
  const returningCustomers = customers.filter((c) => c.totalOrders > 1).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const currentMonthCustomers = customers.filter((c) => new Date(c.createdAt) >= currentMonthStart);
  const lastMonthCustomers = customers.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= lastMonthStart && d <= lastMonthEnd;
  });

  const currentMonthNewCustomers = currentMonthCustomers.filter((c) => c.totalOrders === 0).length;
  const lastMonthNewCustomers = lastMonthCustomers.filter((c) => c.totalOrders === 0).length;

  const currentMonthReturning = customers.filter((c) => {
    if (!c.lastOrderAt) return false;
    const d = new Date(c.lastOrderAt);
    return d >= currentMonthStart && new Date(c.createdAt) < currentMonthStart;
  }).length;
  const lastMonthReturning = customers.filter((c) => {
    if (!c.lastOrderAt) return false;
    const d = new Date(c.lastOrderAt);
    return d >= lastMonthStart && d <= lastMonthEnd && new Date(c.createdAt) < lastMonthStart;
  }).length;

  const currentMonthAvgValue = currentMonthCustomers.length > 0
    ? currentMonthCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / currentMonthCustomers.length
    : 0;
  const lastMonthAvgValue = lastMonthCustomers.length > 0
    ? lastMonthCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / lastMonthCustomers.length
    : 0;

  const totalChange = lastMonthCustomers.length > 0 ? ((currentMonthCustomers.length - lastMonthCustomers.length) / lastMonthCustomers.length) * 100 : 0;
  const newChange = lastMonthNewCustomers > 0 ? ((currentMonthNewCustomers - lastMonthNewCustomers) / lastMonthNewCustomers) * 100 : 0;
  const returningChange = lastMonthReturning > 0 ? ((currentMonthReturning - lastMonthReturning) / lastMonthReturning) * 100 : 0;
  const avgChange = lastMonthAvgValue > 0 ? ((currentMonthAvgValue - lastMonthAvgValue) / lastMonthAvgValue) * 100 : 0;

  const trend = (change: number) => {
    if (change > 0) return "up" as const;
    if (change < 0) return "down" as const;
    return "neutral" as const;
  };

  const kpiStats = [
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      ...(lastMonthCustomers.length > 0 ? { change: totalChange, changeLabel: "vs last month", trend: trend(totalChange), previousValue: lastMonthCustomers.length.toLocaleString() } : { previousValue: "—" }),
      icon: Users,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
    },
    {
      title: "New Customers",
      value: newCustomers.toLocaleString(),
      ...(lastMonthNewCustomers > 0 ? { change: newChange, changeLabel: "vs last month", trend: trend(newChange), previousValue: lastMonthNewCustomers.toLocaleString() } : { previousValue: "—" }),
      icon: UserPlus,
      iconColor: "text-[#00C48C]",
      iconBg: "bg-[#00C48C]/10",
    },
    {
      title: "Returning Customers",
      value: returningCustomers.toLocaleString(),
      ...(lastMonthReturning > 0 ? { change: returningChange, changeLabel: "vs last month", trend: trend(returningChange), previousValue: lastMonthReturning.toLocaleString() } : { previousValue: "—" }),
      icon: TrendingUp,
      iconColor: "text-[#4F8CFF]",
      iconBg: "bg-[#4F8CFF]/10",
    },
    {
      title: "Avg. Customer Value",
      value: `$${averageCustomerValue.toFixed(2)}`,
      ...(lastMonthAvgValue > 0 ? { change: avgChange, changeLabel: "vs last month", trend: trend(avgChange), previousValue: `$${lastMonthAvgValue.toFixed(2)}` } : { previousValue: "—" }),
      icon: Users,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
    },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "New", value: "new" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Highest Spending", value: "highest_spending" },
    { label: "Most Orders", value: "most_orders" },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadCustomers();
  };

  const handleExport = () => {
    if (processedCustomers.length === 0) return;

    const headers = ["Name", "Email", "Phone", "Address", "Orders", "Total Spent", "Avg Order Value", "Last Order", "Status"];
    const rows = processedCustomers.map((c) => {
      const avgOrderValue = c.totalOrders > 0 ? c.totalSpent / c.totalOrders : 0;
      const status = getCustomerStatus(c);
      return [
        c.fullName,
        c.email,
        c.phone,
        c.address,
        c.totalOrders.toString(),
        `$${c.totalSpent.toFixed(2)}`,
        `$${avgOrderValue.toFixed(2)}`,
        c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : "—",
        status.charAt(0).toUpperCase() + status.slice(1),
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusConfig = (status: CustomerStatus) => {
    switch (status) {
      case "new":
        return { label: "New", variant: "info" as const };
      case "active":
        return { label: "Active", variant: "success" as const };
      case "inactive":
        return { label: "Inactive", variant: "secondary" as const };
    }
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage your customers, understand their purchasing behavior, and track customer value.
          </p>
        </div>
        <EmptyState
          icon={Inbox}
          title="No store found"
          description="You need to create a store before viewing customers. Go to the Store page to get started."
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage your customers, understand their purchasing behavior, and track customer value.
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
            Export Customers
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search customers..."
              className="w-full sm:w-64"
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onValueChange={setStatusFilter}
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            />
          </div>
          <p className="text-sm text-[#6B7280]">
            {processedCustomers.length} {processedCustomers.length === 1 ? "customer" : "customers"}
          </p>
        </div>

        <Card padding="none" className="overflow-hidden">
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Avg. Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Last Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8ECF3]">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm text-[#6B7280]">No customers found.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => {
                    const status = getCustomerStatus(customer);
                    const statusConfig = getStatusConfig(status);
                    const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;
                    const initials = customer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={customer.id}
                        className="group transition-colors duration-200 hover:bg-[#F8FAFC]"
                      >
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
                          ${customer.totalSpent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                          ${avgOrderValue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                          {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#F1F5F9]"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E8ECF3] px-6 py-4">
              <p className="text-sm text-[#6B7280]">
                Showing{" "}
                <span className="font-medium text-[#1A1A1A]">
                  {processedCustomers.length > 0 ? (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-[#1A1A1A]">
                  {Math.min(safeCurrentPage * ITEMS_PER_PAGE, processedCustomers.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#1A1A1A]">{processedCustomers.length}</span> customers
              </p>
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </section>

      {selectedCustomer && (
        <CustomerDetailsDrawer
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

export { CustomersPage };
