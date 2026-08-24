import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Package, CreditCard, MapPin, FileText, Clock } from "lucide-react";

interface OrderDetailItem {
  id: string;
  customer: string;
  email: string;
  phone: string;
  products: { name: string; quantity: number; price: string }[];
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  timeline: { status: string; date: string; note: string }[];
  notes: string;
}

interface OrderDetailsDrawerProps {
  order?: OrderDetailItem;
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  className?: string;
}

function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  onAction,
  className,
}: OrderDetailsDrawerProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("fixed inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-[#E8ECF3] bg-white shadow-xl", className)}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Order Details</h2>
              <p className="text-sm text-[#6B7280]">{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Customer Information</h3>
              <div className="rounded-[14px] bg-[#F8FAFC] p-4 space-y-2">
                <p className="text-sm font-medium text-[#1A1A1A]">{order.customer}</p>
                <p className="text-sm text-[#6B7280]">{order.email}</p>
                <p className="text-sm text-[#6B7280]">{order.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Purchased Products</h3>
              <div className="space-y-3">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between rounded-[14px] border border-[#E8ECF3] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F1F5F9]">
                        <Package className="h-5 w-5 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                        <p className="text-xs text-[#6B7280]">Qty: {product.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Shipping Address</h3>
              <div className="rounded-[14px] bg-[#F8FAFC] p-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#7C5CFC] mt-0.5" />
                <p className="text-sm text-[#6B7280] whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Payment Information</h3>
              <div className="rounded-[14px] bg-[#F8FAFC] p-4 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#7C5CFC]" />
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{order.paymentMethod}</p>
                  <p className="text-xs text-[#6B7280]">{order.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Order Timeline</h3>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFC]/10">
                        <Clock className="h-4 w-4 text-[#7C5CFC]" />
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="mt-2 h-full w-px bg-[#E8ECF3]" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-[#1A1A1A]">{event.status}</p>
                      <p className="text-xs text-[#6B7280]">{event.date}</p>
                      <p className="text-xs text-[#6B7280]">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Order Notes</h3>
              <div className="rounded-[14px] bg-[#F8FAFC] p-4 flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#7C5CFC] mt-0.5" />
                <p className="text-sm text-[#6B7280]">{order.notes}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
              <Button className="flex-1" onClick={onAction}>
                Process Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { OrderDetailsDrawer, type OrderDetailItem, type OrderDetailsDrawerProps };
