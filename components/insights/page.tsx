"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar, FilterDropdown } from "@/components/orders";
import { InsightCard } from "@/components/insights/insight-card";
import { InsightDetailsDrawer } from "@/components/insights/insight-details-drawer";
import {
  Sparkles,
  RefreshCw,
  Download,
  AlertTriangle,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  Loader2,
  BarChart3,
  Inbox,
} from "lucide-react";
import { generateInsights, type Insight, type InsightPriority } from "@/app/actions/analyze-insights";
import { fetchStoreByOwnerId } from "@/lib/supabase/stores";
import { fetchOrdersByStore } from "@/lib/supabase/orders";
import { fetchProductsByStore } from "@/lib/supabase/products";
import { fetchCustomersByStore } from "@/lib/supabase/customers";
import {
  fetchStoreMetrics,
  detectProblems,
  type DetectedProblem,
  type ProblemType,
  formatCurrency,
  formatPercentage,
} from "@/lib/supabase/problems";
import { supabase } from "@/lib/supabase/client";

type DateRange = "7d" | "30d" | "90d" | "all";
type PriorityFilter = "all" | InsightPriority;

const ITEMS_PER_PAGE = 9;

const dateRangeOptions = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "All time", value: "all" },
];

const priorityOptions = [
  { label: "All Priorities", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const priorityConfig: Record<InsightPriority, { label: string; variant: "danger" | "warning" | "info" | "secondary" }> = {
  critical: { label: "Critical", variant: "danger" },
  high: { label: "High", variant: "warning" },
  medium: { label: "Medium", variant: "info" },
  low: { label: "Low", variant: "secondary" },
};

const problemTypeLabels: Record<ProblemType, string> = {
  revenue_drop: "Revenue Drop",
  order_drop: "Order Drop",
  product_decline: "Product Decline",
  low_stock: "Low Stock",
  customer_inactivity: "Customer Inactivity",
};

function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [problems, setProblems] = React.useState<DetectedProblem[]>([]);
  const [storeId, setStoreId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange>("30d");
  const [priorityFilter, setPriorityFilter] = React.useState<PriorityFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedInsight, setSelectedInsight] = React.useState<Insight | null>(null);

  const loadStoreData = React.useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      if (!userId) return;

      const userStore = await fetchStoreByOwnerId(userId);
      if (!userStore) return;

      setStoreId(userStore.id);

      const rangeDays = dateRange === "all" ? 365 * 5 : parseInt(dateRange);
      const [storeOrders, storeProducts] = await Promise.all([
        fetchOrdersByStore(userStore.id),
        fetchProductsByStore(userStore.id),
      ]);

      const mappedProducts = storeProducts.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
      }));

      const metrics = await fetchStoreMetrics(userStore.id, rangeDays);
      const detected = detectProblems(metrics, mappedProducts);
      setProblems(detected);
      setError(null);
    } catch {
      setError("Failed to load store data.");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const generateAIInsights = React.useCallback(async () => {
    if (!storeId || problems.length === 0) return;

    setIsAnalyzing(true);
    setAiError(null);

    try {
      const generated = await generateInsights(problems, storeId);
      setInsights(generated);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to generate insights.");
      setInsights([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [problems, storeId]);

  React.useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  React.useEffect(() => {
    if (problems.length > 0) {
      generateAIInsights();
    } else {
      setInsights([]);
    }
  }, [problems, generateAIInsights]);

  const filteredInsights = React.useMemo(() => {
    let result = insights;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.summary.toLowerCase().includes(query) ||
          i.analysis.toLowerCase().includes(query)
      );
    }

    if (priorityFilter !== "all") {
      result = result.filter((i) => i.priority === priorityFilter);
    }

    return result;
  }, [insights, searchQuery, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInsights.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedInsights = filteredInsights.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priorityFilter]);

  const criticalCount = insights.filter((i) => i.priority === "critical").length;
  const highCount = insights.filter((i) => i.priority === "high").length;
  const mediumCount = insights.filter((i) => i.priority === "medium").length;

  const kpiStats = [
    {
      title: "Active Insights",
      value: insights.length.toLocaleString(),
      changeLabel: "total",
      icon: Sparkles,
      iconColor: "text-[#7C5CFC]",
      iconBg: "bg-[#7C5CFC]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Critical",
      value: criticalCount.toLocaleString(),
      changeLabel: "requires attention",
      icon: AlertTriangle,
      iconColor: "text-[#FF5C5C]",
      iconBg: "bg-[#FF5C5C]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "High Priority",
      value: highCount.toLocaleString(),
      changeLabel: "to investigate",
      icon: TrendingDown,
      iconColor: "text-[#FFB800]",
      iconBg: "bg-[#FFB800]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
    {
      title: "Revenue Opportunities",
      value: mediumCount.toLocaleString(),
      changeLabel: "medium priority",
      icon: DollarSign,
      iconColor: "text-[#4F8CFF]",
      iconBg: "bg-[#4F8CFF]/10",
      trend: "neutral" as const,
      previousValue: "—",
    },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadStoreData();
  };

  const handleExport = () => {
    if (filteredInsights.length === 0) return;

    const headers = ["Title", "Summary", "Priority", "Analysis", "Impact", "Recommendation", "Created At"];
    const rows = filteredInsights.map((i) => [
      i.title,
      i.summary,
      i.priority,
      i.analysis,
      i.impact,
      i.recommendation,
      new Date(i.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-insights.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRetry = async () => {
    if (storeId) {
      await generateAIInsights();
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">AI Insights</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            AI-powered insights that help you understand what's happening in your store and decide what to do next.
          </p>
        </div>
        <EmptyState
          icon={AlertTriangle}
          title="No store found"
          description="You need to create a store before viewing AI insights."
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">AI Insights</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            AI-powered insights that help you understand what's happening in your store and decide what to do next.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
          {problems.length > 0 && (
            <button
              onClick={generateAIInsights}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 rounded-[14px] border border-[#7C5CFC] bg-[#7C5CFC] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6B5DFF] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                </>
              )}
            </button>
          )}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {aiError && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {aiError}
          <button
            onClick={handleRetry}
            className="ml-3 inline-flex items-center gap-1 text-xs font-medium underline"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
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

      {problems.length > 0 && (
        <section className="rounded-[14px] bg-[#F8FAFC] p-4">
          <p className="text-sm text-[#6B7280]">
            <span className="font-medium text-[#1A1A1A]">{problems.length}</span> revenue problem
            {problems.length !== 1 ? "s" : ""} detected in the selected period. AI is generating insights from this data.
          </p>
        </section>
      )}

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
              label="Priority"
              options={priorityOptions}
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v as PriorityFilter)}
            />
            <SearchBar
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search insights..."
              className="w-full sm:w-64"
            />
          </div>
          <p className="text-sm text-[#6B7280]">
            {filteredInsights.length} {filteredInsights.length === 1 ? "insight" : "insights"}
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7C5CFC]" />
              <p className="mt-3 text-sm text-[#6B7280]">
                AI is analyzing your store data and generating insights...
              </p>
            </div>
          </div>
        )}

        {!isAnalyzing && filteredInsights.length === 0 ? (
          <Card padding="default">
            <EmptyState
              icon={Sparkles}
              title={problems.length === 0 ? "No significant insights yet" : "No insights for selected filters"}
              description={
                problems.length === 0
                  ? "Continue collecting store data and we'll surface meaningful opportunities as trends emerge."
                  : "Try adjusting your filters to see more insights."
              }
            />
          </Card>
        ) : (
          !isAnalyzing && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onClick={() => setSelectedInsight(insight)}
                />
              ))}
            </div>
          )
        )}
      </section>

      {filteredInsights.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            Showing{" "}
            <span className="font-medium text-[#1A1A1A]">
              {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#1A1A1A]">
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredInsights.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#1A1A1A]">{filteredInsights.length}</span> insights
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage(safeCurrentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage(safeCurrentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedInsight && (
        <InsightDetailsDrawer
          insight={selectedInsight}
          isOpen={!!selectedInsight}
          onClose={() => setSelectedInsight(null)}
          onNavigateToProblem={() => {
            setSelectedInsight(null);
            router.push("/dashboard/problems");
          }}
        />
      )}
    </div>
  );
}

export { InsightsPage };
