"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StoreLayout } from "@/components/store/store-layout";
import { useCart } from "@/components/store/cart-context";
import { useOrders } from "@/components/store/order-context";
import { fetchStoreBySlug, type Store } from "@/lib/supabase/stores";
import type { Order } from "@/data/stores";
import { ShoppingCart, Loader2, CheckCircle2, CreditCard, Package } from "lucide-react";
import Link from "next/link";

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

const emptyFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

function CheckoutProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Checkout", icon: ShoppingCart },
    { label: "Payment", icon: CreditCard },
    { label: "Confirmation", icon: Package },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const Icon = step.icon;

          return (
            <div key={step.label} className="flex items-center">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isActive
                      ? "border-[#7C5CFC] bg-[#7C5CFC] text-white shadow-lg shadow-[#7C5CFC]/30"
                      : isCompleted
                      ? "border-[#00C48C] bg-[#00C48C] text-white"
                      : "border-[#E8ECF3] bg-white text-[#6B7280]"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-[#7C5CFC]"
                      : isCompleted
                      ? "text-[#00C48C]"
                      : "text-[#6B7280]"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-4 h-px w-12 bg-[#E8ECF3] sm:w-16">
                  <div
                    className={cn(
                      "h-full bg-[#00C48C] transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckoutPageInner({ store, slug }: { store: Store; slug: string }) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<FormData>(emptyFormData);
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});

  const shipping = 0;
  const total = subtotal + shipping;

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate() || items.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderId = `ORD-${Date.now()}`;
      const order = {
        id: orderId,
        storeId: store.id,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: [...items],
        subtotal,
        shipping,
        total,
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
      };

      addOrder(order as Order);

      router.push(`/store/${slug}/payment?orderId=${orderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to your cart before checking out."
          action={
            <Link href={`/store/${slug}`}>
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Complete your order from <span className="font-medium text-[#7C5CFC]">{store.name}</span>
        </p>
      </div>

      <CheckoutProgress currentStep={0} />

      {error && (
        <div className="mb-6 rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg" className="shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Customer Information</h2>
                <p className="mt-1 text-sm text-[#6B7280]">Enter your details to complete the order</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                    Full Name
                    <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className={cn(
                      "h-12 rounded-[14px]",
                      formErrors.name && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF5C5C]">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                    Email
                    <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className={cn(
                      "h-12 rounded-[14px]",
                      formErrors.email && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF5C5C]">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="h-12 rounded-[14px]"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                    Address
                    <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St"
                    className={cn(
                      "h-12 rounded-[14px]",
                      formErrors.address && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={isSubmitting}
                  />
                  {formErrors.address && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF5C5C]">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                    City
                    <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className={cn(
                      "h-12 rounded-[14px]",
                      formErrors.city && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={isSubmitting}
                  />
                  {formErrors.city && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF5C5C]">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="postalCode" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                    Postal Code
                    <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="10001"
                    className={cn(
                      "h-12 rounded-[14px]",
                      formErrors.postalCode && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={isSubmitting}
                  />
                  {formErrors.postalCode && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF5C5C]">
                      {formErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card padding="lg" className="shadow-sm">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Order Summary</h3>
                  <p className="mt-1 text-xs text-[#6B7280]">
                    {items.length} {items.length === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 rounded-[14px] border border-[#E8ECF3] bg-[#F8FAFC] p-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-white">
                        {item.product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full rounded-[10px] object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#6B7280]">
                            {item.product.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#1A1A1A] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-[#1A1A1A] mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-[#E8ECF3] pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-medium text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Shipping</span>
                    <span className="font-medium text-[#00C48C]">Free</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E8ECF3] pt-3 text-base font-semibold">
                    <span className="text-[#1A1A1A]">Total</span>
                    <span className="text-[#1A1A1A]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 h-12 rounded-[14px] text-base font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>

                <Link href={`/store/${slug}`}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full mt-3 h-11 rounded-[14px]"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </Card>

              <div className="rounded-[14px] border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]/10">
                    <svg className="h-4 w-4 text-[#7C5CFC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1A1A1A]">Secure Checkout</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function CheckoutPage() {
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Store not found"
          description="The store you are looking for does not exist."
          action={
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <StoreLayout store={store}>
      <CheckoutPageInner store={store} slug={slug} />
    </StoreLayout>
  );
}

export default CheckoutPage;
