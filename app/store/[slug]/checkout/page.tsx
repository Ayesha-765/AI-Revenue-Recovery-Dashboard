"use client";

import * as React from "react";
import { StoreLayout } from "@/components/store/store-layout";
import { CheckoutForm } from "@/components/store/checkout-form";
import { OrderSuccess } from "@/components/store/order-success";
import { mockStores } from "@/data/stores";
import type { Order } from "@/data/stores";

interface CheckoutPageProps {
  params: { slug: string };
}

function getStore(slug: string) {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

function CheckoutPage({ params }: CheckoutPageProps) {
  const store = React.useMemo(() => getStore(params.slug), [params.slug]);
  const [order, setOrder] = React.useState<Order | null>(null);

  const handleOrderCreated = (createdOrder: Order) => {
    setOrder(createdOrder);
  };

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#6B7280]">Store not found.</p>
      </div>
    );
  }

  if (order) {
    return (
      <StoreLayout store={store}>
        <OrderSuccess
          orderId={order.id}
          customerName={order.customer.name}
          total={order.total}
          items={order.items}
        />
      </StoreLayout>
    );
  }

  return (
    <StoreLayout store={store}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8">Checkout</h1>
        <CheckoutForm onOrderCreated={handleOrderCreated} />
      </div>
    </StoreLayout>
  );
}

export default CheckoutPage;
