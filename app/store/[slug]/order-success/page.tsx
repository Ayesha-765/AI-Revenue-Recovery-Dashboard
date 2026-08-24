"use client";

import * as React from "react";
import { StoreLayout } from "@/components/store/store-layout";
import { useCart } from "@/components/store/cart-context";
import { useOrders } from "@/components/store/order-context";
import { fetchStoreBySlug, type Store } from "@/lib/supabase/stores";
import { useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Package, CreditCard, Truck } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "card" | "cod" | null;

function OrderSuccessPageInner({ store, orderId, slug }: { store: Store; orderId: string; slug: string }) {
  const { clearCart } = useCart();
  const { getOrder } = useOrders();
  const [order, setOrder] = React.useState<{
    customerName: string;
    customerEmail: string;
    total: number;
    items: { product: { id: string; name: string; price?: number }; quantity: number }[];
    paymentMethod: PaymentMethod;
    status: string;
  } | null>(null);

  const getOrderRef = React.useRef(getOrder);
  getOrderRef.current = getOrder;

  const clearCartRef = React.useRef(clearCart);
  clearCartRef.current = clearCart;

  React.useEffect(() => {
    const foundOrder = getOrderRef.current(orderId);
    if (foundOrder) {
      let paymentMethod: PaymentMethod = null;
      if (foundOrder.paymentStatus === "paid") {
        paymentMethod = "card";
      }

      setOrder({
        customerName: foundOrder.customer.name,
        customerEmail: foundOrder.customer.email,
        total: foundOrder.total,
        items: foundOrder.items.map((item) => ({
          product: { id: item.product.id, name: item.product.name, price: item.product.price },
          quantity: item.quantity,
        })),
        paymentMethod,
        status: foundOrder.status,
      });
    }
    clearCartRef.current();
  }, [orderId]);

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#6B7280]">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00C48C]/10">
          <CheckCircle2 className="h-8 w-8 text-[#00C48C]" />
        </div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
          Order Successfully Placed! 🎉
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
        </p>
      </div>

      <Card padding="lg" className="shadow-sm mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Order ID</span>
            <span className="font-medium text-[#1A1A1A]">{orderId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Customer</span>
            <span className="font-medium text-[#1A1A1A]">{order.customerName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Email</span>
            <span className="font-medium text-[#1A1A1A]">{order.customerEmail}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Payment Method</span>
            <span className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
              {order.paymentMethod === "card" ? (
                <>
                  <CreditCard className="h-4 w-4 text-[#7C5CFC]" />
                  Credit / Debit Card
                </>
              ) : order.paymentMethod === "cod" ? (
                <>
                  <Truck className="h-4 w-4 text-[#00C48C]" />
                  Cash on Delivery
                </>
              ) : (
                "Not specified"
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Order Status</span>
            <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#00C48C]/10 px-2.5 py-0.5 text-xs font-medium text-[#00C48C]">
              <Package className="h-3 w-3" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {order.items.length > 0 && (
            <div className="border-t border-[#E8ECF3] pt-4">
              <p className="text-sm font-medium text-[#1A1A1A] mb-3">Ordered Products</p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] truncate max-w-[200px]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#1A1A1A]">
                      ${((item.product.price ?? 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-[#E8ECF3] pt-4">
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="text-[#1A1A1A]">Total Amount</span>
              <span className="text-[#1A1A1A]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href={`/store/${slug}`}>
          <Button size="lg" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [store, setStore] = React.useState<Store | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function loadStore() {
      const storeData = await fetchStoreBySlug(slug);
      if (mounted) {
        setStore(storeData);
      }
      if (mounted) {
        setIsLoading(false);
      }
    }

    loadStore();

    return () => {
      mounted = false;
    };
  }, [slug]);

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

  if (!orderId) {
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
      <OrderSuccessPageInner store={store} orderId={orderId} slug={slug} />
    </StoreLayout>
  );
}

export default OrderSuccessPage;
