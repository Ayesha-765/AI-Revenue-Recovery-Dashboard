import { supabase } from "./client";

export interface DbOrder {
  id: string;
  store_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderInsert {
  store_id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  subtotal: number;
  shipping: number;
  total: number;
  status?: string;
  payment_status?: string;
}

export interface OrderItemInsert {
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

function mapDbOrderToOrder(db: DbOrder, items: OrderItem[]): Order {
  return {
    id: db.id,
    storeId: db.store_id,
    customerId: db.customer_id,
    customerName: db.customer_name,
    customerEmail: db.customer_email,
    customerPhone: db.customer_phone || "",
    customerAddress: db.customer_address,
    customerCity: db.customer_city,
    customerPostalCode: db.customer_postal_code,
    subtotal: db.subtotal,
    shipping: db.shipping,
    total: db.total,
    status: db.status,
    paymentStatus: db.payment_status,
    createdAt: db.created_at,
    items,
  };
}

export async function fetchOrdersByStore(storeId: string): Promise<Order[]> {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error || !orders) {
      console.error("[fetchOrdersByStore] Supabase error", { error, storeId });
      return [];
    }

    const mappedOrders: Order[] = [];
    for (const dbOrder of orders as DbOrder[]) {
      const items = await fetchOrderItems(dbOrder.id);
      mappedOrders.push(mapDbOrderToOrder(dbOrder, items));
    }

    return mappedOrders;
  } catch {
    return [];
  }
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("id", { ascending: true });

    if (error || !data) {
      return [];
    }

    return (data as DbOrderItem[]).map((item) => ({
      id: item.id,
      orderId: item.order_id,
      productId: item.product_id,
      productName: item.product_name,
      productPrice: item.product_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));
  } catch {
    return [];
  }
}

export async function createOrder(data: OrderInsert): Promise<{ success: boolean; error?: string; order?: DbOrder }> {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        store_id: data.store_id,
        customer_id: data.customer_id || null,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        customer_address: data.customer_address,
        customer_city: data.customer_city,
        customer_postal_code: data.customer_postal_code,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        status: data.status || "pending",
        payment_status: data.payment_status || "pending",
      })
      .select()
      .single();

    if (error || !order) {
      return {
        success: false,
        error: error?.message || "Failed to create order. Please try again.",
      };
    }

    return {
      success: true,
      order: order as DbOrder,
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function createOrderItems(items: OrderItemInsert[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("order_items").insert(items);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create order items. Please try again.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function reduceProductStock(productId: string, quantity: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    const currentStock = product.stock as number;
    if (currentStock < quantity) {
      return {
        success: false,
        error: "Insufficient stock.",
      };
    }

    const newStock = currentStock - quantity;

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to update stock. Please try again.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function fetchRevenueByStore(storeId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("total")
      .eq("store_id", storeId);

    if (error || !data) {
      return 0;
    }

    return (data as { total: number }[]).reduce((sum, order) => sum + order.total, 0);
  } catch {
    return 0;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("[updateOrderStatus] Supabase error", { error, orderId, status });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
