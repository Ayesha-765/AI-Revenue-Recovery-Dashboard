"use client";

import * as React from "react";
import type { Order } from "@/data/stores";

interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const ORDER_STORAGE_KEY = "orders";

function loadOrdersFromStorage(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function saveOrdersToStorage(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore storage errors
  }
}

function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = React.useState<Order[]>(() => loadOrdersFromStorage());

  React.useEffect(() => {
    saveOrdersToStorage(orders);
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === order.id);
      if (exists) {
        return prev.map((o) => (o.id === order.id ? order : o));
      }
      return [order, ...prev];
    });
  };

  const getOrder = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

function useOrders() {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}

const OrderContext = React.createContext<OrderContextValue | undefined>(undefined);

export { OrderProvider, useOrders, type OrderContextValue };
