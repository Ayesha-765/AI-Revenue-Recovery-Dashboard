"use client";

import * as React from "react";
import { StoreLayout } from "@/components/store/store-layout";
import { OrderSuccess } from "@/components/store/order-success";
import { useCart } from "@/components/store/cart-context";
import { fetchStoreBySlug } from "@/lib/supabase/stores";
import { fetchOrderItems } from "@/lib/supabase/orders";
import { useSearchParams, useParams } from "next/navigation";
import type { Store } from "@/lib/supabase/stores";

function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [store, setStore] = React.useState<Store | null>(null);
  const [order, setOrder] = React.useState<{ customerName: string; total: number; items: { product: { name: string }; quantity: number }[] } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { clearCart } = useCart();

  React.useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!slug) {
        if (mounted) setIsLoading(false);
        return;
      }

      const storeData = await fetchStoreBySlug(slug);
      if (mounted) {
        setStore(storeData);
      }

      if (orderId && storeData) {
        const items = await fetchOrderItems(orderId);
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        if (mounted) {
          setOrder({
            customerName: "Customer",
            total,
            items: items.map((item) => ({
              product: { name: item.productName },
              quantity: item.quantity,
            })),
          });
        }
      }

      if (mounted) {
        setIsLoading(false);
        clearCart();
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [orderId, slug, clearCart]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#6B7280]">Store not found.</p>
      </div>
    );
  }

  if (!order || !orderId) {
    return (
      <StoreLayout store={store}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-[#6B7280]">Order not found.</p>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout store={store}>
      <OrderSuccess
        orderId={orderId}
        customerName={order.customerName}
        total={order.total}
        items={order.items.map((item) => ({
          product: { id: "", name: item.product.name, price: 0 },
          quantity: item.quantity,
        }))}
      />
    </StoreLayout>
  );
}

export default OrderSuccessPage;
