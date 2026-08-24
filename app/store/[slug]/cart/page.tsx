"use client";

import * as React from "react";
import { StoreLayout } from "@/components/store/store-layout";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/store/cart-item";
import { fetchStoreBySlug, type Store } from "@/lib/supabase/stores";
import Link from "next/link";
import { useParams } from "next/navigation";

function CartPageInner({ store, slug }: { store: Store; slug: string }) {
  const { items, subtotal, clearCart } = useCart();
  const shipping = 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-4">Your Cart</h1>
        <p className="text-[#6B7280] mb-8">Your cart is empty.</p>
        <Link href={`/store/${slug}`}>
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Your Cart</h1>
        <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-[18px] border border-[#E8ECF3] bg-white p-6">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280] truncate max-w-[150px]">
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
                <span className="font-medium text-[#00C48C]">Free</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span className="text-[#1A1A1A]">Total</span>
                <span className="text-[#1A1A1A]">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link href={`/store/${slug}/checkout`}>
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </Link>
            <Link href={`/store/${slug}`}>
              <Button variant="secondary" className="w-full mt-2">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-[#6B7280]">Store not found.</p>
      </div>
    );
  }

  return (
    <StoreLayout store={store}>
      <CartPageInner store={store} slug={slug} />
    </StoreLayout>
  );
}

export default CartPage;
