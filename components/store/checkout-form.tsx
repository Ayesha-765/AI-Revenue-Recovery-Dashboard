"use client";

import * as React from "react";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchStoreBySlug } from "@/lib/supabase/stores";
import { createOrder, createOrderItems, reduceProductStock } from "@/lib/supabase/orders";
import type { Store } from "@/lib/supabase/stores";

interface CheckoutFormProps {
  onOrderCreated?: (order: { id: string; customerName: string; total: number; items: { product: { name: string }; quantity: number }[] }) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const emptyFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const [store, setStore] = React.useState<Store | null>(null);
  const [formData, setFormData] = React.useState<FormData>(emptyFormData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadStore() {
      const storeData = await fetchStoreBySlug(slug);
      if (mounted) {
        setStore(storeData);
      }
    }

    loadStore();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate() || !store) return;
    setIsSubmitting(true);

    try {
      const shipping = 0;
      const total = subtotal + shipping;

      const orderResult = await createOrder({
        store_id: store.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        customer_postal_code: formData.postalCode,
        subtotal,
        shipping,
        total,
        status: "pending",
      });

      if (!orderResult.success || !orderResult.order) {
        setSubmitError(orderResult.error || "Failed to create order.");
        setIsSubmitting(false);
        return;
      }

      const orderItems = items.map((item) => ({
        order_id: orderResult.order!.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      const itemsResult = await createOrderItems(orderItems);
      if (!itemsResult.success) {
        setSubmitError(itemsResult.error || "Failed to create order items.");
        setIsSubmitting(false);
        return;
      }

      for (const item of items) {
        const stockResult = await reduceProductStock(item.product.id, item.quantity);
        if (!stockResult.success) {
          setSubmitError(stockResult.error || "Failed to update stock.");
          setIsSubmitting(false);
          return;
        }
      }

      clearCart();

      if (onOrderCreated) {
        onOrderCreated({
          id: orderResult.order.id,
          customerName: formData.name,
          total,
          items: items.map((item) => ({
            product: { id: item.product.id, name: item.product.name, price: item.product.price },
            quantity: item.quantity,
          })),
        });
      } else {
        router.push(`/store/${slug}/order-success?orderId=${orderResult.order.id}`);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Your cart is empty.</p>
        <Link href={`/store/${slug}`}>
          <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Customer Information</h2>
        {submitError && (
          <div className="rounded-[14px] border border-[#FF5C5C]/20 bg-[#FF5C5C]/5 px-4 py-3 text-sm text-[#FF5C5C]">
            {submitError}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
            {errors.name && <p className="mt-1 text-xs text-[#FF5C5C]">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
            {errors.email && <p className="mt-1 text-xs text-[#FF5C5C]">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
            {errors.phone && <p className="mt-1 text-xs text-[#FF5C5C]">{errors.phone}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
            {errors.address && <p className="mt-1 text-xs text-[#FF5C5C]">{errors.address}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
            {errors.city && <p className="mt-1 text-xs text-[#FF5C5C]">{errors.city}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">Postal Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
            />
            {errors.postalCode && <p className="mt-1 text-xs text-[#FF5C5C]">{errors.postalCode}</p>}
          </div>
        </div>
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
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
          <Link href={`/store/${slug}`}>
            <Button variant="secondary" className="w-full mt-2">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}

export { CheckoutForm, type CheckoutFormProps };
