import { supabase } from "./client";

export interface DbCustomer {
  id: string;
  store_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  total_orders: number;
  total_spent: number;
  first_order_at: string | null;
  last_order_at: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  storeId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  createdAt: string;
}

export interface CustomerInsert {
  store_id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
}

function mapDbCustomerToCustomer(db: DbCustomer): Customer {
  return {
    id: db.id,
    storeId: db.store_id,
    fullName: db.full_name,
    email: db.email,
    phone: db.phone || "",
    address: db.address || "",
    totalOrders: db.total_orders,
    totalSpent: db.total_spent,
    firstOrderAt: db.first_order_at,
    lastOrderAt: db.last_order_at,
    createdAt: db.created_at,
  };
}

export async function fetchCustomerByEmail(storeId: string, email: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("store_id", storeId)
      .eq("email", email)
      .single();

    if (error || !data) {
      return null;
    }

    return mapDbCustomerToCustomer(data as DbCustomer);
  } catch {
    return null;
  }
}

export async function createCustomer(data: CustomerInsert): Promise<{ success: boolean; error?: string; customer?: Customer }> {
  try {
    const { data: customer, error } = await supabase
      .from("customers")
      .insert({
        store_id: data.store_id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        total_orders: 0,
        total_spent: 0,
      })
      .select()
      .single();

    if (error || !customer) {
      return {
        success: false,
        error: error?.message || "Failed to create customer.",
      };
    }

    return {
      success: true,
      customer: mapDbCustomerToCustomer(customer as DbCustomer),
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function updateCustomerStats(
  customerId: string,
  stats: { totalOrders?: number; totalSpent?: number; firstOrderAt?: string; lastOrderAt?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const dbData: Record<string, unknown> = {};
    if (stats.totalOrders !== undefined) dbData.total_orders = stats.totalOrders;
    if (stats.totalSpent !== undefined) dbData.total_spent = stats.totalSpent;
    if (stats.firstOrderAt !== undefined) dbData.first_order_at = stats.firstOrderAt;
    if (stats.lastOrderAt !== undefined) dbData.last_order_at = stats.lastOrderAt;

    const { error } = await supabase
      .from("customers")
      .update(dbData)
      .eq("id", customerId);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update customer stats.",
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

export async function fetchCustomersByStore(storeId: string): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("[fetchCustomersByStore] Supabase error", { error, storeId });
      return [];
    }

    return (data as DbCustomer[]).map(mapDbCustomerToCustomer);
  } catch {
    return [];
  }
}

export async function fetchCustomerById(customerId: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error || !data) {
      return null;
    }

    return mapDbCustomerToCustomer(data as DbCustomer);
  } catch {
    return null;
  }
}
