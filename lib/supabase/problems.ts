import { supabase } from "./client";
import { fetchOrdersByStore } from "./orders";
import { fetchProductsByStore } from "./products";
import { fetchCustomersByStore } from "./customers";

export type ProblemType = "revenue_drop" | "order_drop" | "product_decline" | "low_stock" | "customer_inactivity";

export type ProblemSeverity = "critical" | "warning" | "info";

export interface DetectedProblem {
  id: string;
  type: ProblemType;
  severity: ProblemSeverity;
  title: string;
  description: string;
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  estimatedImpact: number;
  detectedAt: string;
  metadata: Record<string, unknown>;
}

export interface PeriodComparison {
  currentRevenue: number;
  previousRevenue: number;
  currentOrders: number;
  previousOrders: number;
  currentProducts: Map<string, number>;
  previousProducts: Map<string, number>;
  currentCustomerIds: Set<string>;
  previousCustomerIds: Set<string>;
}

function getPeriodDates(rangeDays: number): { currentStart: Date; previousStart: Date; previousEnd: Date } {
  const now = new Date();
  const currentEnd = now;
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - rangeDays);
  const previousEnd = new Date(currentStart);
  previousEnd.setDate(currentStart.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousEnd.getDate() - rangeDays);

  return { currentStart, previousStart, previousEnd };
}

function isInPeriod(dateStr: string, start: Date, end: Date): boolean {
  const date = new Date(dateStr);
  return date >= start && date <= end;
}

export async function fetchStoreMetrics(storeId: string, rangeDays: number): Promise<PeriodComparison> {
  const orders = await fetchOrdersByStore(storeId);
  const products = await fetchProductsByStore(storeId);
  const customers = await fetchCustomersByStore(storeId);

  const { currentStart, previousStart, previousEnd } = getPeriodDates(rangeDays);

  let currentRevenue = 0;
  let previousRevenue = 0;
  let currentOrders = 0;
  let previousOrders = 0;
  const currentProducts = new Map<string, number>();
  const previousProducts = new Map<string, number>();
  const currentCustomerIds = new Set<string>();
  const previousCustomerIds = new Set<string>();

  for (const order of orders) {
    const orderDate = new Date(order.createdAt);
    const inCurrent = orderDate >= currentStart && orderDate <= new Date();
    const inPrevious = orderDate >= previousStart && orderDate <= previousEnd;

    if (inCurrent) {
      currentRevenue += order.total;
      currentOrders++;
      currentCustomerIds.add(order.customerEmail);
      for (const item of order.items) {
        currentProducts.set(item.productId, (currentProducts.get(item.productId) || 0) + item.quantity);
      }
    } else if (inPrevious) {
      previousRevenue += order.total;
      previousOrders++;
      previousCustomerIds.add(order.customerEmail);
      for (const item of order.items) {
        previousProducts.set(item.productId, (previousProducts.get(item.productId) || 0) + item.quantity);
      }
    }
  }

  return {
    currentRevenue,
    previousRevenue,
    currentOrders,
    previousOrders,
    currentProducts,
    previousProducts,
    currentCustomerIds,
    previousCustomerIds,
  };
}

export function detectProblems(metrics: PeriodComparison, products: { id: string; name: string; stock: number }[]): DetectedProblem[] {
  const problems: DetectedProblem[] = [];
  const now = new Date().toISOString();

  const revenueChange = metrics.previousRevenue > 0
    ? ((metrics.currentRevenue - metrics.previousRevenue) / metrics.previousRevenue) * 100
    : metrics.currentRevenue > 0 ? 100 : 0;

  if (metrics.previousRevenue > 0 && revenueChange < -15) {
    const severity: DetectedProblem["severity"] =
      revenueChange < -30 ? "critical" : "warning";
    problems.push({
      id: "revenue-drop",
      type: "revenue_drop",
      severity,
      title: "Revenue dropped significantly",
      description: `Revenue decreased from $${metrics.previousRevenue.toFixed(2)} to $${metrics.currentRevenue.toFixed(2)} compared with the previous period.`,
      currentValue: metrics.currentRevenue,
      previousValue: metrics.previousRevenue,
      changePercentage: revenueChange,
      estimatedImpact: metrics.previousRevenue - metrics.currentRevenue,
      detectedAt: now,
      metadata: {},
    });
  }

  const orderChange = metrics.previousOrders > 0
    ? ((metrics.currentOrders - metrics.previousOrders) / metrics.previousOrders) * 100
    : metrics.currentOrders > 0 ? 100 : 0;

  if (metrics.previousOrders > 0 && orderChange < -15) {
    const severity: DetectedProblem["severity"] =
      orderChange < -30 ? "critical" : "warning";
    problems.push({
      id: "order-drop",
      type: "order_drop",
      severity,
      title: "Order volume declined",
      description: `Orders decreased from ${metrics.previousOrders} to ${metrics.currentOrders} compared with the previous period.`,
      currentValue: metrics.currentOrders,
      previousValue: metrics.previousOrders,
      changePercentage: orderChange,
      estimatedImpact: 0,
      detectedAt: now,
      metadata: {},
    });
  }

  for (const product of products) {
    const currentQty = metrics.currentProducts.get(product.id) || 0;
    const previousQty = metrics.previousProducts.get(product.id) || 0;

    if (previousQty > 0 && currentQty === 0) {
      problems.push({
        id: `product-decline-${product.id}`,
        type: "product_decline",
        severity: "warning",
        title: `No sales for ${product.name}`,
        description: `This product had ${previousQty} units sold in the previous period but zero sales in the current period.`,
        currentValue: 0,
        previousValue: previousQty,
        changePercentage: -100,
        estimatedImpact: 0,
        detectedAt: now,
        metadata: { productId: product.id, productName: product.name },
      });
    } else if (previousQty > 0 && currentQty > 0) {
      const change = ((currentQty - previousQty) / previousQty) * 100;
      if (change < -50) {
        problems.push({
          id: `product-decline-${product.id}`,
          type: "product_decline",
          severity: "info",
          title: `Sales dropped for ${product.name}`,
          description: `Sales decreased from ${previousQty} to ${currentQty} units compared with the previous period.`,
          currentValue: currentQty,
          previousValue: previousQty,
          changePercentage: change,
          estimatedImpact: 0,
          detectedAt: now,
          metadata: { productId: product.id, productName: product.name },
        });
      }
    }
  }

  for (const product of products) {
    if (product.stock === 0) {
      problems.push({
        id: `out-of-stock-${product.id}`,
        type: "low_stock",
        severity: "critical",
        title: `${product.name} is out of stock`,
        description: `This product has no remaining inventory and cannot be purchased.`,
        currentValue: 0,
        previousValue: product.stock,
        changePercentage: -100,
        estimatedImpact: 0,
        detectedAt: now,
        metadata: { productId: product.id, productName: product.name },
      });
    } else if (product.stock < 5) {
      problems.push({
        id: `low-stock-${product.id}`,
        type: "low_stock",
        severity: "warning",
        title: `Low stock: ${product.name}`,
        description: `Only ${product.stock} units remaining. Consider restocking soon.`,
        currentValue: product.stock,
        previousValue: product.stock,
        changePercentage: 0,
        estimatedImpact: 0,
        detectedAt: now,
        metadata: { productId: product.id, productName: product.name },
      });
    }
  }

  const churnedCustomers = [...metrics.previousCustomerIds].filter((id) => !metrics.currentCustomerIds.has(id));
  if (churnedCustomers.length > 0 && metrics.previousCustomerIds.size > 0) {
    const churnRate = (churnedCustomers.length / metrics.previousCustomerIds.size) * 100;
    if (churnRate > 30) {
      problems.push({
        id: "customer-inactivity",
        type: "customer_inactivity",
        severity: "warning",
        title: "Customer activity declined",
        description: `${churnedCustomers.length} of ${metrics.previousCustomerIds.size} previous customers made no purchases this period.`,
        currentValue: metrics.currentCustomerIds.size,
        previousValue: metrics.previousCustomerIds.size,
        changePercentage: -churnRate,
        estimatedImpact: 0,
        detectedAt: now,
        metadata: { churnedCount: churnedCustomers.length },
      });
    }
  }

  return problems;
}

export function calculateSeverity(problem: DetectedProblem): DetectedProblem["severity"] {
  if (problem.type === "low_stock" && problem.currentValue === 0) return "critical";
  if (problem.type === "revenue_drop" && problem.changePercentage < -30) return "critical";
  if (problem.type === "revenue_drop" && problem.changePercentage < -15) return "warning";
  if (problem.type === "order_drop" && problem.changePercentage < -30) return "critical";
  if (problem.type === "order_drop" && problem.changePercentage < -15) return "warning";
  if (problem.type === "customer_inactivity") return "warning";
  if (problem.type === "product_decline") return "info";
  return "info";
}

export function calculateRevenueImpact(problem: DetectedProblem): number {
  if (problem.estimatedImpact > 0) return problem.estimatedImpact;
  if (problem.type === "revenue_drop") {
    return Math.abs(problem.currentValue - problem.previousValue);
  }
  if (problem.type === "order_drop" && problem.currentValue > 0) {
    return Math.abs(problem.currentValue - problem.previousValue) * problem.currentValue / (problem.previousValue || 1);
  }
  return 0;
}

export function getRecommendedAction(problem: DetectedProblem): string {
  switch (problem.type) {
    case "revenue_drop":
      return "Review recent order trends, top-performing products, and checkout performance.";
    case "order_drop":
      return "Check marketing campaigns, product availability, and checkout flow.";
    case "product_decline":
      return "Review product pricing, inventory, and customer feedback.";
    case "low_stock":
      return "Review inventory and restock the affected product.";
    case "customer_inactivity":
      return "Launch a re-engagement campaign or review customer experience.";
    default:
      return "Investigate the issue further.";
  }
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
