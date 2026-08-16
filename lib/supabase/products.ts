import { supabase } from "./client";

export interface DbProduct {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  active: boolean;
}

export interface DashboardProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: "active" | "draft" | "archived";
}

function mapDbProductToProduct(db: DbProduct): Product {
  return {
    id: db.id,
    storeId: db.store_id,
    name: db.name,
    description: db.description || "",
    price: db.price,
    image: db.image || "",
    stock: db.stock,
    active: db.active,
  };
}

function mapDbProductToDashboardProduct(db: DbProduct): DashboardProduct {
  return {
    id: db.id,
    name: db.name,
    description: db.description || "",
    price: db.price,
    stock: db.stock,
    imageUrl: db.image || "",
    status: db.active ? "active" : "draft",
  };
}

export async function fetchProductsByStore(storeId: string): Promise<DashboardProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return (data as DbProduct[]).map(mapDbProductToDashboardProduct);
  } catch {
    return [];
  }
}

export async function fetchActiveProductsByStore(storeId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeId)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return (data as DbProduct[]).map(mapDbProductToProduct);
  } catch {
    return [];
  }
}

export async function createProduct(data: {
  store_id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  active: boolean;
}): Promise<{ success: boolean; error?: string; product?: DashboardProduct }> {
  try {
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        store_id: data.store_id,
        name: data.name,
        description: data.description || null,
        price: data.price,
        image: data.image || null,
        stock: data.stock,
        active: data.active,
      })
      .select()
      .single();

    if (error || !product) {
      return {
        success: false,
        error: error?.message || "Failed to create product. Please try again.",
      };
    }

    return {
      success: true,
      product: mapDbProductToDashboardProduct(product as DbProduct),
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    stock?: number;
    active?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const dbData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) dbData.name = data.name;
    if (data.description !== undefined) dbData.description = data.description || null;
    if (data.price !== undefined) dbData.price = data.price;
    if (data.image !== undefined) dbData.image = data.image || null;
    if (data.stock !== undefined) dbData.stock = data.stock;
    if (data.active !== undefined) dbData.active = data.active;

    const { error } = await supabase
      .from("products")
      .update(dbData)
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update product. Please try again.",
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

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to delete product. Please try again.",
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
