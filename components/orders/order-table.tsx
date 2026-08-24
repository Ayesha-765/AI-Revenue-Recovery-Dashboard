import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MoreHorizontal, Eye } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  productCount: number;
  total: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  fulfillmentStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

interface OrderTableProps {
  orders: Order[];
  onViewOrder?: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalFiltered?: number;
  className?: string;
}

const paymentStatusConfig = {
  paid: { label: "Paid", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
  failed: { label: "Failed", variant: "danger" as const },
  refunded: { label: "Refunded", variant: "secondary" as const },
};

const fulfillmentStatusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  processing: { label: "Processing", variant: "info" as const },
  shipped: { label: "Shipped", variant: "default" as const },
  delivered: { label: "Delivered", variant: "success" as const },
  cancelled: { label: "Cancelled", variant: "danger" as const },
};

function OrderTable({
  orders,
  onViewOrder,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalFiltered = 0,
  className,
}: OrderTableProps) {
  const startIndex = totalFiltered > 0 ? (currentPage - 1) * orders.length + 1 : 0;
  const endIndex = Math.min(currentPage * orders.length, totalFiltered);

  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Orders</h3>
        <p className="text-sm text-[#6B7280]">
          Monitor and manage customer orders
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8ECF3]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Fulfillment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECF3]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-sm text-[#6B7280]">No orders found.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const paymentStatus = paymentStatusConfig[order.paymentStatus];
                const fulfillmentStatus = fulfillmentStatusConfig[order.fulfillmentStatus];
                const initials = order.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={order.id}
                    className="group transition-colors duration-200 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#1A1A1A]">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src=""
                          alt={order.customer}
                          fallback={initials}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{order.customer}</p>
                          <p className="text-xs text-[#6B7280]">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                      {order.productCount}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-[#1A1A1A]">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={paymentStatus.variant}>{paymentStatus.label}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={fulfillmentStatus.variant}>{fulfillmentStatus.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#6B7280]">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewOrder?.(order.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#F1F5F9]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#F1F5F9]">
                          <MoreHorizontal className="h-4 w-4" />
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

      <div className="flex items-center justify-between border-t border-[#E8ECF3] px-6 py-4">
        <p className="text-sm text-[#6B7280]">
          Showing{" "}
          <span className="font-medium text-[#1A1A1A]">
            {totalFiltered > 0 ? startIndex : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium text-[#1A1A1A]">{endIndex}</span> of{" "}
          <span className="font-medium text-[#1A1A1A]">{totalFiltered}</span> orders
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E8ECF3] px-4 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC] disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px] text-sm font-medium transition-all duration-200",
                currentPage === page
                  ? "bg-[#7C5CFC] text-white shadow-sm"
                  : "border border-[#E8ECF3] text-[#6B7280] hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E8ECF3] px-4 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

export { OrderTable, type Order, type OrderTableProps };
