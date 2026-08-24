"use client";

import * as React from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StoreLayout } from "@/components/store/store-layout";
import { useCart } from "@/components/store/cart-context";
import { useOrders } from "@/components/store/order-context";
import { fetchStoreBySlug, type Store } from "@/lib/supabase/stores";
import { createOrder, createOrderItems, reduceProductStock } from "@/lib/supabase/orders";
import { fetchCustomerByEmail, createCustomer, updateCustomerStats } from "@/lib/supabase/customers";
import type { Order } from "@/data/stores";
import { CreditCard, Truck, Loader2, XCircle, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "card" | "cod";
type PaymentStatus = "idle" | "processing" | "success" | "failed" | "cancelled";

type CardFormData = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

const emptyCardFormData: CardFormData = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

function CheckoutProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Checkout", icon: CreditCard },
    { label: "Payment", icon: CreditCard },
    { label: "Confirmation", icon: CheckCircle2 },
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

function PaymentPageInner({ store, orderId, slug }: { store: Store; orderId: string; slug: string }) {
  const router = useRouter();
  const { getOrder, addOrder } = useOrders();
  const { items } = useCart();
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("card");
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [cardData, setCardData] = React.useState<CardFormData>(emptyCardFormData);
  const [cardErrors, setCardErrors] = React.useState<Partial<Record<keyof CardFormData, string>>>({});

  const pendingOrder = getOrder(orderId);
  const shipping = 0;
  const total = pendingOrder ? pendingOrder.total : (items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + shipping);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    }
    return digits;
  };

  const validateCard = (): boolean => {
    const errors: Partial<Record<keyof CardFormData, string>> = {};

    if (!cardData.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required";
    }

    const cardDigits = cardData.cardNumber.replace(/\s/g, "");
    if (!cardDigits) {
      errors.cardNumber = "Card number is required";
    } else if (cardDigits.length < 16) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
    }

    const expiryDigits = cardData.expiry.replace(/\s/g, "").replace("/", "");
    if (!expiryDigits) {
      errors.expiry = "Expiry date is required";
    } else if (expiryDigits.length < 4) {
      errors.expiry = "Please enter a valid expiry date";
    }

    if (!cardData.cvv) {
      errors.cvv = "CVV is required";
    } else if (cardData.cvv.length < 3) {
      errors.cvv = "Please enter a valid CVV";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async () => {
    setErrorMessage(null);

    if (paymentMethod === "card" && !validateCard()) {
      return;
    }

    if (!pendingOrder) {
      setErrorMessage("Order not found. Please return to checkout.");
      return;
    }

    setPaymentStatus("processing");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let customerId = pendingOrder.customer.email
        ? (await fetchCustomerByEmail(store.id, pendingOrder.customer.email))?.id
        : null;

      if (!customerId) {
        const customerResult = await createCustomer({
          store_id: store.id,
          full_name: pendingOrder.customer.name,
          email: pendingOrder.customer.email,
          phone: pendingOrder.customer.phone || undefined,
          address: pendingOrder.customer.address || undefined,
        });

        if (!customerResult.success || !customerResult.customer) {
          setPaymentStatus("failed");
          setErrorMessage(customerResult.error || "Failed to create customer.");
          return;
        }

        customerId = customerResult.customer.id;
      }

      const orderResult = await createOrder({
        store_id: store.id,
        customer_id: customerId,
        customer_name: pendingOrder.customer.name,
        customer_email: pendingOrder.customer.email,
        customer_phone: pendingOrder.customer.phone || undefined,
        customer_address: pendingOrder.customer.address,
        customer_city: pendingOrder.customer.city,
        customer_postal_code: pendingOrder.customer.postalCode,
        subtotal: pendingOrder.subtotal,
        shipping: pendingOrder.shipping,
        total: pendingOrder.total,
        status: "confirmed",
        payment_status: "paid",
      });

      if (!orderResult.success || !orderResult.order) {
        setPaymentStatus("failed");
        setErrorMessage(orderResult.error || "Payment failed. Please try again.");
        return;
      }

      const orderItems = pendingOrder.items.map((item) => ({
        order_id: orderResult.order!.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      const itemsResult = await createOrderItems(orderItems);
      if (!itemsResult.success) {
        setPaymentStatus("failed");
        setErrorMessage(itemsResult.error || "Failed to create order items.");
        return;
      }

      for (const item of pendingOrder.items) {
        const stockResult = await reduceProductStock(item.product.id, item.quantity);
        if (!stockResult.success) {
          setPaymentStatus("failed");
          setErrorMessage(stockResult.error || "Failed to update stock.");
          return;
        }
      }

      const existingCustomer = await fetchCustomerByEmail(store.id, pendingOrder.customer.email);
      if (existingCustomer) {
        const newTotalOrders = existingCustomer.totalOrders + 1;
        const newTotalSpent = existingCustomer.totalSpent + pendingOrder.total;
        const now = new Date().toISOString();

        await updateCustomerStats(existingCustomer.id, {
          totalOrders: newTotalOrders,
          totalSpent: newTotalSpent,
          lastOrderAt: now,
          firstOrderAt: existingCustomer.firstOrderAt || now,
        });
      }

      const confirmedOrder: Order = {
        ...pendingOrder,
        id: orderResult.order.id,
        status: "confirmed",
        paymentStatus: "paid",
      };

      addOrder(confirmedOrder);
      setPaymentStatus("success");

      setTimeout(() => {
        router.push(`/store/${slug}/order-success?orderId=${orderResult.order!.id}`);
      }, 1500);
    } catch {
      setPaymentStatus("failed");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    setPaymentStatus("cancelled");
    setTimeout(() => {
      router.push(`/store/${slug}/checkout`);
    }, 1500);
  };

  if (!pendingOrder) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <EmptyState
          icon={CreditCard}
          title="Order not found"
          description="We could not find your pending order. Please try checkout again."
          action={
            <Link href={`/store/${slug}/checkout`}>
              <Button>Back to Checkout</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00C48C]/10">
          <CheckCircle2 className="h-8 w-8 text-[#00C48C]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Payment Successful!</h2>
        <p className="mt-2 text-sm text-[#6B7280]">Order Successfully Placed!</p>
        <p className="mt-1 text-xs text-[#6B7280]">Redirecting to order confirmation...</p>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF5C5C]/10">
          <XCircle className="h-8 w-8 text-[#FF5C5C]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Payment Failed</h2>
        <p className="mt-2 text-sm text-[#6B7280]">{errorMessage || "Something went wrong. Please try again."}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={handlePayNow}>Retry Payment</Button>
          <Button variant="secondary" onClick={() => router.push(`/store/${slug}/checkout`)}>
            Back to Checkout
          </Button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "cancelled") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFB800]/10">
          <XCircle className="h-8 w-8 text-[#D4A000]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Payment Cancelled</h2>
        <p className="mt-2 text-sm text-[#6B7280]">Your payment was cancelled. You can retry or return to checkout.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={handlePayNow}>Retry Payment</Button>
          <Button variant="secondary" onClick={() => router.push(`/store/${slug}/checkout`)}>
            Back to Checkout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Payment</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Complete your payment securely for <span className="font-medium text-[#7C5CFC]">{store.name}</span>
        </p>
      </div>

      <CheckoutProgress currentStep={1} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg" className="shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A]">Payment Method</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Select your preferred payment method</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex items-center gap-4 rounded-[14px] border-2 p-4 text-left transition-all duration-200",
                  paymentMethod === "card"
                    ? "border-[#7C5CFC] bg-[#7C5CFC]/5 shadow-sm"
                    : "border-[#E8ECF3] bg-white hover:border-[#7C5CFC]/40"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200",
                    paymentMethod === "card" ? "bg-[#7C5CFC] text-white" : "bg-[#F1F5F9] text-[#6B7280]"
                  )}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Credit / Debit Card</p>
                  <p className="text-xs text-[#6B7280]">Pay securely with card</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={cn(
                  "flex items-center gap-4 rounded-[14px] border-2 p-4 text-left transition-all duration-200",
                  paymentMethod === "cod"
                    ? "border-[#7C5CFC] bg-[#7C5CFC]/5 shadow-sm"
                    : "border-[#E8ECF3] bg-white hover:border-[#7C5CFC]/40"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200",
                    paymentMethod === "cod" ? "bg-[#7C5CFC] text-white" : "bg-[#F1F5F9] text-[#6B7280]"
                  )}
                >
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Cash on Delivery</p>
                  <p className="text-xs text-[#6B7280]">Pay when you receive</p>
                </div>
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-5 rounded-[14px] border border-[#E8ECF3] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]">
                  <CreditCard className="h-4 w-4 text-[#7C5CFC]" />
                  Card Details
                </div>

                <div>
                  <label htmlFor="cardholderName" className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                    Cardholder Name <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="cardholderName"
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                    placeholder="John Doe"
                    className={cn(
                      "h-12 rounded-[14px]",
                      cardErrors.cardholderName && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={paymentStatus === "processing"}
                  />
                  {cardErrors.cardholderName && (
                    <p className="mt-1.5 text-xs text-[#FF5C5C]">{cardErrors.cardholderName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                    Card Number <span className="text-[#FF5C5C]">*</span>
                  </label>
                  <Input
                    id="cardNumber"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={cn(
                      "h-12 rounded-[14px]",
                      cardErrors.cardNumber && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                    )}
                    disabled={paymentStatus === "processing"}
                  />
                  {cardErrors.cardNumber && (
                    <p className="mt-1.5 text-xs text-[#FF5C5C]">{cardErrors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                      Expiry Date <span className="text-[#FF5C5C]">*</span>
                    </label>
                    <Input
                      id="expiry"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM / YY"
                      maxLength={7}
                      className={cn(
                        "h-12 rounded-[14px]",
                        cardErrors.expiry && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                      )}
                      disabled={paymentStatus === "processing"}
                    />
                    {cardErrors.expiry && (
                      <p className="mt-1.5 text-xs text-[#FF5C5C]">{cardErrors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="mb-2 block text-sm font-medium text-[#1A1A1A]">
                      CVV <span className="text-[#FF5C5C]">*</span>
                    </label>
                    <Input
                      id="cvv"
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      maxLength={4}
                      className={cn(
                        "h-12 rounded-[14px]",
                        cardErrors.cvv && "border-[#FF5C5C] focus:border-[#FF5C5C] focus:ring-[#FF5C5C]/20"
                      )}
                      disabled={paymentStatus === "processing"}
                    />
                    {cardErrors.cvv && (
                      <p className="mt-1.5 text-xs text-[#FF5C5C]">{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-[10px] bg-[#7C5CFC]/5 px-3 py-2 text-xs text-[#6B7280]">
                  <Lock className="h-3.5 w-3.5 text-[#7C5CFC]" />
                  This is a dummy/test payment. No real card information is processed or stored.
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="rounded-[14px] border border-[#E8ECF3] bg-[#F8FAFC] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00C48C]/10">
                    <Truck className="h-5 w-5 text-[#00C48C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">Cash on Delivery</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Pay with cash when your order is delivered to your doorstep. Please have the exact amount ready.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handlePayNow}
                disabled={paymentStatus === "processing"}
                className="flex-1 h-12 rounded-[14px] text-base font-semibold"
              >
                {paymentStatus === "processing" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  `Pay Now — $${total.toFixed(2)}`
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={paymentStatus === "processing"}
                className="h-12 rounded-[14px]"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card padding="lg" className="shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Order Summary</h3>
                <p className="mt-1 text-xs text-[#6B7280]">
                  {pendingOrder.items.length} {pendingOrder.items.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              <div className="space-y-3">
                {pendingOrder.items.map((item) => (
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
                  <span className="font-medium text-[#1A1A1A]">${pendingOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Shipping</span>
                  <span className="font-medium text-[#00C48C]">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#E8ECF3] pt-3 text-base font-semibold">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="text-[#1A1A1A]">${pendingOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentPage() {
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
      <PaymentPageInner store={store} orderId={orderId} slug={slug} />
    </StoreLayout>
  );
}

export default PaymentPage;
