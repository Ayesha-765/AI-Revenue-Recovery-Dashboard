"use client";

import * as React from "react";
import type { Order } from "@/data/stores";

interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderContext = React.createContext<OrderContextValue | undefined>(undefined);

function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = React.useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
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

export { OrderProvider, useOrders, type OrderContextValue };
