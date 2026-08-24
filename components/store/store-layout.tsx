"use client";

import * as React from "react";
import { CartProvider, useCart } from "@/components/store/cart-context";
import { OrderProvider, useOrders } from "@/components/store/order-context";
import { StoreNavbar } from "@/components/store/store-navbar";
import { StoreFooter } from "@/components/store/store-footer";
import type { Store } from "@/data/stores";

function StoreLayoutInner({ store, children }: { store: Store; children: React.ReactNode }) {
  const { totalItems } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <StoreNavbar store={store} cartItemCount={totalItems} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
}

export function StoreLayout({ store, children }: { store: Store; children: React.ReactNode }) {
  return (
    <OrderProvider>
      <CartProvider>
        <StoreLayoutInner store={store}>{children}</StoreLayoutInner>
      </CartProvider>
    </OrderProvider>
  );
}
