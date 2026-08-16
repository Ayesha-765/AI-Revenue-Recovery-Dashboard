"use client";

import * as React from "react";
import { StoreLayout } from "@/components/store/store-layout";
import { OrderSuccess } from "@/components/store/order-success";
import { useCart } from "@/components/store/cart-context";
import { mockStores } from "@/data/stores";

interface OrderSuccessPageProps {
  params: { slug: string };
}

function getStore(slug: string) {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const store = React.useMemo(() => getStore(params.slug), [params.slug]);
  const { items, subtotal, clearCart } = useCart();
  const [orderId] = React.useState(() => `ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#6B7280]">Store not found.</p>
      </div>
    );
  }

  const total = subtotal;

  return (
    <StoreLayout store={store}>
      <OrderSuccess
        orderId={orderId}
        customerName={items[0]?.product.name || "Customer"}
        total={total}
      />
    </StoreLayout>
  );
}

export default OrderSuccessPage;
