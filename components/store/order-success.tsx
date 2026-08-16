"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { CartItem } from "@/data/stores";

interface OrderSuccessProps {
  orderId: string;
  customerName: string;
  total: number;
  items?: CartItem[];
}

function OrderSuccess({ orderId, customerName, total, items = [] }: OrderSuccessProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#00C48C]/10">
        <CheckCircle2 className="h-8 w-8 text-[#00C48C]" />
      </div>
      <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
        Order Successful!
      </h1>
      <p className="mt-4 text-base text-[#6B7280]">
        Thank you for your order, {customerName}!
      </p>

      <div className="mt-8 rounded-[18px] border border-[#E8ECF3] bg-white p-6 text-left">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Order ID</span>
            <span className="font-medium text-[#1A1A1A]">{orderId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Customer</span>
            <span className="font-medium text-[#1A1A1A]">{customerName}</span>
          </div>
          {items.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#1A1A1A] mb-2">Products</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] truncate max-w-[200px]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#1A1A1A]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Total Amount</span>
            <span className="font-medium text-[#1A1A1A]">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Status</span>
            <span className="inline-flex items-center rounded-[10px] bg-[#FFB800]/10 px-2.5 py-0.5 text-xs font-medium text-[#D4A000]">
              Pending
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

export { OrderSuccess, type OrderSuccessProps };
