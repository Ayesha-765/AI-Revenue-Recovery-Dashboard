import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: string;
  conversionRate: string;
  growth: number;
  trend: "up" | "down" | "neutral";
}

interface TopProductsTableProps {
  products?: Product[];
  className?: string;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "",
    unitsSold: 234,
    revenue: "$28,450",
    conversionRate: "4.2%",
    growth: 12.5,
    trend: "up",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    image: "",
    unitsSold: 189,
    revenue: "$22,780",
    conversionRate: "3.8%",
    growth: 8.3,
    trend: "up",
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    image: "",
    unitsSold: 156,
    revenue: "$18,720",
    conversionRate: "3.5%",
    growth: -2.1,
    trend: "down",
  },
  {
    id: "4",
    name: "Organic Coffee Beans 1kg",
    image: "",
    unitsSold: 412,
    revenue: "$12,360",
    conversionRate: "5.1%",
    growth: 24.8,
    trend: "up",
  },
  {
    id: "5",
    name: "Minimalist Desk Lamp",
    image: "",
    unitsSold: 98,
    revenue: "$7,840",
    conversionRate: "2.9%",
    growth: -5.4,
    trend: "down",
  },
];

function TopProductsTable({ products = defaultProducts, className }: TopProductsTableProps) {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">
          Top Performing Products
        </h3>
        <p className="text-sm text-[#6B7280]">
          Products generating the most revenue this period
        </p>
      </div>

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
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Conversion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Growth
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECF3]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="group transition-colors duration-200 hover:bg-[#F8FAFC]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F1F5F9] text-sm font-medium text-[#6B7280]">
                      {product.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                  {product.unitsSold.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-[#1A1A1A]">
                  {product.revenue}
                </td>
                <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                  {product.conversionRate}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {product.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-[#00C48C]" />
                    ) : product.trend === "down" ? (
                      <ArrowDownRight className="h-4 w-4 text-[#FF5C5C]" />
                    ) : null}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        product.trend === "up"
                          ? "text-[#00C48C]"
                          : product.trend === "down"
                          ? "text-[#FF5C5C]"
                          : "text-[#6B7280]"
                      )}
                    >
                      {product.growth > 0 ? "+" : ""}{product.growth}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#F1F5F9]">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export { TopProductsTable, type Product, type TopProductsTableProps };
