"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, Users, Mail, Phone, MapPin, Calendar, ShoppingBag, TrendingUp } from "lucide-react";
import type { Customer } from "@/lib/supabase/customers";

interface CustomerDetailsDrawerProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

function CustomerDetailsDrawer({ customer, isOpen, onClose }: CustomerDetailsDrawerProps) {
  if (!isOpen) return null;

  const status = customer.totalOrders === 0 ? "new" : customer.lastOrderAt ? (() => {
    const daysSince = (Date.now() - new Date(customer.lastOrderAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 30 ? "active" : "inactive";
  })() : "inactive";

  const statusConfig = {
    new: { label: "New", variant: "info" as const },
    active: { label: "Active", variant: "success" as const },
    inactive: { label: "Inactive", variant: "secondary" as const },
  };

  const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;
  const initials = customer.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("fixed inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-[#E8ECF3] bg-white shadow-xl")}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Customer Details</h2>
              <p className="text-sm text-[#6B7280]">{customer.email}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-xl font-bold text-[#7C5CFC]">
                {initials}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{customer.fullName}</h3>
                <Badge variant={statusConfig[status].variant} className="mt-1">
                  {statusConfig[status].label}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10">
                    <ShoppingBag className="h-5 w-5 text-[#7C5CFC]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Total Orders</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{customer.totalOrders}</p>
                  </div>
                </div>
              </Card>
              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#00C48C]/10">
                    <TrendingUp className="h-5 w-5 text-[#00C48C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Total Spent</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">${customer.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#4F8CFF]/10">
                    <Mail className="h-5 w-5 text-[#4F8CFF]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">${avgOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
              <Card padding="default">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FFB800]/10">
                    <Calendar className="h-5 w-5 text-[#FFB800]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Customer Since</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card padding="default">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#6B7280]" />
                  <span className="text-sm text-[#1A1A1A]">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#6B7280]" />
                    <span className="text-sm text-[#1A1A1A]">{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[#6B7280]" />
                    <span className="text-sm text-[#1A1A1A]">{customer.address}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card padding="default">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Order Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">First Order</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {customer.firstOrderAt ? new Date(customer.firstOrderAt).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Last Order</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CustomerDetailsDrawer, type CustomerDetailsDrawerProps };
