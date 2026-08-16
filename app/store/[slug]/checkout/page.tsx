"use client";

import * as React from "react";
import { StoreLayout } from "@/components/store/store-layout";
import { CheckoutForm } from "@/components/store/checkout-form";
import { OrderSuccess } from "@/components/store/order-success";
import { fetchStoreBySlug } from "@/lib/supabase/stores";
import type { Store } from "@/lib/supabase/stores";

interface CheckoutPageProps {
  params: { slug: string };
}

type CreatedOrder = {
  id: string;
  customerName: string;
  total: number;
  items: { product: { name: string }; quantity: number }[];
};

function CheckoutPage({ params }: CheckoutPageProps) {
  const [store, setStore] = React.useState<Store | null>(null);
  const [order, setOrder] = React.useState<CreatedOrder | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadStore() {
      const storeData = await fetchStoreBySlug(params.slug);
      if (mounted) {
        setStore(storeData);
        setIsLoading(false);
      }
    }

    loadStore();

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const handleOrderCreated = (createdOrder: CreatedOrder) => {
    setOrder(createdOrder);
  };

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

  if (order) {
    return (
      <StoreLayout store={store}>
        <OrderSuccess
          orderId={order.id}
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
