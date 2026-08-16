"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/data/products";
import { productStatusConfig } from "@/data/products";

interface ProductTableProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  className?: string;
}

function ProductImagePlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F5F9] text-xs font-medium text-[#6B7280]">
      {initials}
    </div>
  );
}

function ProductTable({
  products,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  className,
}: ProductTableProps) {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="flex flex-col gap-4 p-6 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Products</h3>
          <p className="text-sm text-[#6B7280]">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>
        <div className="w-full sm:w-64">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8ECF3]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Stock
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-[#6B7280]">No products found.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = productStatusConfig[product.status];
                return (
                  <tr
                    key={product.id}
                    className="group transition-colors duration-200 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ProductImagePlaceholder name={product.name} />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-xs text-[#6B7280] line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-[#1A1A1A]">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[#F1F5F9]"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#FF5C5C] transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[#FF5C5C]/10"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </Card>
  );
}

export { ProductTable, type ProductTableProps };
