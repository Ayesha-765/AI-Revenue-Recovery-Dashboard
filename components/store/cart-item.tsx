"use client";

import * as React from "react";
import { useCart } from "@/components/store/cart-context";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/data/stores";

interface CartItemProps {
  item: CartItemType;
}

function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-[#E8ECF3] bg-white p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F5F9]">
        {item.product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.product.image}
            alt={item.product.name}
            className="h-full w-full rounded-[10px] object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-[#6B7280]">
            {item.product.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-[#1A1A1A] truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-[#6B7280]">
          ${item.product.price.toFixed(2)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-[10px] border border-[#E8ECF3]">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="flex h-8 w-8 items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="flex h-8 w-8 items-center justify-center text-xs font-medium text-[#1A1A1A] border-x border-[#E8ECF3]">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="flex h-8 w-8 items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.product.id)}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { CartItem };
