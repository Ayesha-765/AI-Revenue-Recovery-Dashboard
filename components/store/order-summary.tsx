"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import type { CartItem as CartItemType } from "@/data/stores";

interface OrderSummaryProps {
  items: CartItemType[];
  subtotal: number;
  shipping?: number;
}

function OrderSummary({ items, subtotal, shipping = 0 }: OrderSummaryProps) {
  const total = subtotal + shipping;

  return (
    <Card padding="default">
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Order Summary</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280] truncate max-w-[180px]">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium text-[#1A1A1A]">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-[#E8ECF3] pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Subtotal</span>
          <span className="font-medium text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">Shipping</span>
          <span className="font-medium text-[#00C48C]">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-[#1A1A1A]">Total</span>
          <span className="text-[#1A1A1A]">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}

export { OrderSummary, type OrderSummaryProps };
