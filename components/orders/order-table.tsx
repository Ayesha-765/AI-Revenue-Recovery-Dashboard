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
  orders?: Order[];
  onViewOrder?: (id: string) => void;
  className?: string;
}

const defaultOrders: Order[] = [
  {
    id: "ORD-2847",
    customer: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    productCount: 3,
    total: "$245.00",
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
    date: "2026-08-07",
  },
  {
    id: "ORD-2846",
    customer: "Michael Chen",
    customerEmail: "michael@example.com",
    productCount: 1,
    total: "$89.00",
    paymentStatus: "pending",
    fulfillmentStatus: "processing",
    date: "2026-08-07",
  },
  {
    id: "ORD-2845",
    customer: "Emily Davis",
    customerEmail: "emily@example.com",
    productCount: 2,
    total: "$156.50",
    paymentStatus: "failed",
    fulfillmentStatus: "pending",
    date: "2026-08-06",
  },
  {
    id: "ORD-2844",
    customer: "James Wilson",
    customerEmail: "james@example.com",
    productCount: 4,
    total: "$512.00",
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    date: "2026-08-06",
  },
  {
    id: "ORD-2843",
    customer: "Lisa Anderson",
    customerEmail: "lisa@example.com",
    productCount: 1,
    total: "$67.00",
    paymentStatus: "refunded",
    fulfillmentStatus: "cancelled",
    date: "2026-08-05",
  },
  {
    id: "ORD-2842",
    customer: "David Brown",
    customerEmail: "david@example.com",
    productCount: 2,
    total: "$178.00",
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    date: "2026-08-05",
  },
  {
    id: "ORD-2841",
    customer: "Jennifer Lee",
    customerEmail: "jennifer@example.com",
    productCount: 5,
    total: "$890.00",
    paymentStatus: "paid",
    fulfillmentStatus: "pending",
    date: "2026-08-04",
  },
];

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

function OrderTable({ orders = defaultOrders, onViewOrder, className }: OrderTableProps) {
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
            {orders.map((order) => {
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
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#E8ECF3] px-6 py-4">
        <p className="text-sm text-[#6B7280]">
          Showing <span className="font-medium text-[#1A1A1A]">1</span> to{" "}
          <span className="font-medium text-[#1A1A1A]">{orders.length}</span> of{" "}
          <span className="font-medium text-[#1A1A1A]">1,247</span> orders
        </p>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E8ECF3] text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC] disabled:opacity-50">
            Previous
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#7C5CFC] text-sm font-medium text-white">
            1
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E8ECF3] text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            2
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E8ECF3] text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            3
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E8ECF3] text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

export { OrderTable, type Order, type OrderTableProps };
