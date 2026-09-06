"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar, FilterDropdown, Pagination } from "@/components/orders";
import { ProblemDetailsDrawer } from "@/components/problems/problem-details-drawer";
import {
  AlertTriangle,
  RefreshCw,
  Download,
  TrendingDown,
  TrendingUp,
  Minus,
  Eye,
  Package,
  Users,
  DollarSign,
} from "lucide-react";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchProductsByStore } from "@/lib/supabase/products";
import {
  fetchStoreMetrics,
  detectProblems,
  type DetectedProblem,
  type ProblemType,
  type ProblemSeverity,
  formatCurrency,
  formatPercentage,
} from "@/lib/supabase/problems";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

type DateRange = "7d" | "30d" | "90d" | "all";
type SeverityFilter = "all" | "critical" | "warning" | "info";
type TypeFilter = "all" | ProblemType;

const dateRangeOptions = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "All time", value: "all" },
];

const severityOptions = [
  { label: "All Severity", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "Warning", value: "warning" },
  { label: "Info", value: "info" },
];

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Revenue Drop", value: "revenue_drop" },
  { label: "Order Drop", value: "order_drop" },
  { label: "Product Decline", value: "product_decline" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Customer Inactivity", value: "customer_inactivity" },
];

const severityConfig: Record<ProblemSeverity, { label: string; variant: "danger" | "warning" | "info" }> = {
  critical: { label: "Critical", variant: "danger" },
  warning: { label: "Warning", variant: "warning" },
  info: { label: "Info", variant: "info" },
};

const problemTypeLabels: Record<ProblemType, string> = {
  revenue_drop: "Revenue Drop",
  order_drop: "Order Drop",
  product_decline: "Product Decline",
  low_stock: "Low Stock",
  customer_inactivity: "Customer Inactivity",
};

const problemTypeIcons: Record<ProblemType, React.ReactNode> = {
  revenue_drop: <DollarSign className="h-4 w-4" />,
  order_drop: <TrendingDown className="h-4 w-4" />,
  product_decline: <Package className="h-4 w-4" />,
  low_stock: <Package className="h-4 w-4" />,
  customer_inactivity: <Users className="h-4 w-4" />,
};

function ProblemsPage() {
  const [problems, setProblems] = React.useState<DetectedProblem[]>([]);
  const [allProblems, setAllProblems] = React.useState<DetectedProblem[]>([]);
  const [products, setProducts] = React.useState<{ id: string; name: string; stock: number }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [storeId, setStoreId] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange>("30d");
  const [severityFilter, setSeverityFilter] = React.useState<SeverityFilter>("all");
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedProblem, setSelectedProblem] = React.useState<DetectedProblem | null>(null);

  const loadProblems = React.useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      if (!userId) return;

      const userStore = await fetchStoreByOwnerId(userId);
      if (!userStore) return;

      setStoreId(userStore.id);

      const rangeDays = dateRange === "all" ? 365 * 5 : parseInt(dateRange);
      const [metrics, storeProducts] = await Promise.all([
        fetchStoreMetrics(userStore.id, rangeDays),
        fetchProductsByStore(userStore.id),
      ]);

      const mappedProducts = storeProducts.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
      }));
      setProducts(mappedProducts);

      const detected = detectProblems(metrics, mappedProducts);
      setAllProblems(detected);
      setError(null);
    } catch {
      setError("Failed to analyze revenue problems.");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  React.useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  const filteredProblems = React.useMemo(() => {
    let result = allProblems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          problemTypeLabels[p.type].toLowerCase().includes(query)
      );
    }

    if (severityFilter !== "all") {
      result = result.filter((p) => p.severity === severityFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((p) => p.type === typeFilter);
    }

    return result;
  }, [allProblems, searchQuery, severityFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProblems = filteredProblems.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, severityFilter, typeFilter]);

  const totalProblems = allProblems.length;
  const criticalProblems = allProblems.filter((p) => p.severity === "critical").length;
  const warningProblems = allProblems.filter((p) => p.severity === "warning").length;
  const infoProblems = allProblems.filter((p) => p.severity === "info").length;
  const estimatedRevenueAtRisk = allProblems.reduce((sum, p) => sum + p.estimatedImpact, 0);

  const kpiStats = [
    {
      title: "Total Problems",
      value: totalProblems.toLocaleString(),
      changeLabel: "detected",
      icon: AlertTriangle,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Critical",
      value: criticalProblems.toLocaleString(),
      changeLabel: "require attention",
      icon: AlertTriangle,
      iconColor: "text-[#FF5C5C]",
      iconBg: "bg-[#FF5C5C]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Warning",
      value: warningProblems.toLocaleString(),
      changeLabel: "to investigate",
      icon: AlertTriangle,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Est. Revenue at Risk",
      value: formatCurrency(estimatedRevenueAtRisk),
      changeLabel: "potential impact",
      icon: DollarSign,
      iconColor: "text-[#FF5C5C]",
      iconBg: "bg-[#FF5C5C]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadProblems();
  };

  const handleExport = () => {
    if (filteredProblems.length === 0) return;

    const headers = ["Type", "Severity", "Title", "Description", "Current Value", "Previous Value", "Change", "Est. Impact", "Detected At"];
    const rows = filteredProblems.map((p) => [
      problemTypeLabels[p.type],
      p.severity,
      p.title,
      p.description,
      formatCurrency(p.currentValue),
      formatCurrency(p.previousValue),
      formatPercentage(p.changePercentage),
      formatCurrency(p.estimatedImpact),
      new Date(p.detectedAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue-problems.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-[#00C48C]" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-[#FF5C5C]" />;
    return <Minus className="h-4 w-4 text-[#6B7280]" />;
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Revenue Problems</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Identify issues that may be costing your store revenue and take action before they grow.
          </p>
        </div>
        <EmptyState
          icon={AlertTriangle}
          title="No store found"
          description="You need to create a store before viewing revenue problems. Go to the Store page to get started."
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Revenue Problems</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Identify issues that may be costing your store revenue and take action before they grow.
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
            Export
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
            <FilterDropdown
              label="Period"
              options={dateRangeOptions}
              value={dateRange}
              onValueChange={(v) => setDateRange(v as DateRange)}
            />
            <FilterDropdown
              label="Severity"
              options={severityOptions}
              value={severityFilter}
              onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}
            />
            <FilterDropdown
              label="Type"
              options={typeOptions}
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as TypeFilter)}
            />
            <SearchBar
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search problems..."
              className="w-full sm:w-64"
            />
          </div>
          <p className="text-sm text-[#6B7280]">
            {filteredProblems.length} {filteredProblems.length === 1 ? "problem" : "problems"}
          </p>
        </div>

        {filteredProblems.length === 0 ? (
          <Card padding="default">
            <EmptyState
              icon={AlertTriangle}
              title="No revenue problems detected"
              description="Your store looks healthy for the selected period."
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProblems.map((problem) => {
              const severity = severityConfig[problem.severity];
              return (
                <Card
                  key={problem.id}
                  hoverable
                  padding="default"
                  className="group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={severity.variant}>{severity.label}</Badge>
                      <span className="text-xs text-[#6B7280]">{problemTypeLabels[problem.type]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-[#FF5C5C]">
                      {getChangeIcon(problem.changePercentage)}
                      <span>{formatPercentage(problem.changePercentage)}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#7C5CFC] transition-colors">
                    {problem.title}
                  </h3>

                  <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div>
                      <span className="text-xs text-[#6B7280]">Current</span>
                      <p className="font-semibold text-[#1A1A1A]">{formatCurrency(problem.currentValue)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#6B7280]">Previous</span>
                      <p className="font-semibold text-[#1A1A1A]">{formatCurrency(problem.previousValue)}</p>
                    </div>
                  </div>

                  {problem.estimatedImpact > 0 && (
                    <div className="rounded-[10px] bg-[#FF5C5C]/5 px-3 py-2 mb-4">
                      <p className="text-xs text-[#6B7280]">Estimated revenue at risk</p>
                      <p className="text-sm font-semibold text-[#FF5C5C]">{formatCurrency(problem.estimatedImpact)}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B7280]">
                      {new Date(problem.detectedAt).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProblem(problem)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {filteredProblems.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            Showing{" "}
            <span className="font-medium text-[#1A1A1A]">
              {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#1A1A1A]">
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProblems.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#1A1A1A]">{filteredProblems.length}</span> problems
          </p>
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {selectedProblem && (
        <ProblemDetailsDrawer
          problem={selectedProblem}
          isOpen={!!selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
}

export { ProblemsPage };
