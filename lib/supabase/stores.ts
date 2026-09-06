import { supabase } from "./client";

export interface DbStore {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  logo: string | null;
  slug: string;
  hero_title: string | null;
  hero_description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  published: boolean;
  createdAt: string;
}

function mapDbStoreToStore(db: DbStore): Store {
  return {
    id: db.id,
    ownerId: db.owner_id,
    name: db.name,
    description: db.description || "",
    logo: db.logo || "",
    slug: db.slug,
    heroTitle: db.hero_title || "",
    heroDescription: db.hero_description || "",
    published: db.published,
    createdAt: db.created_at,
  };
}

export async function fetchStoreByOwnerId(ownerId: string): Promise<Store | null> {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", ownerId)
      .single();

    if (error || !data) {
      console.error("[fetchStoreByOwnerId] Supabase error", { error, ownerId });
      return null;
    }

    return mapDbStoreToStore(data as DbStore);
  } catch {
    return null;
  }
}

export async function fetchStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error("fetchStoreBySlug error", {
        slug,
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        raw: error,
      });
      return null;
    }

    if (!data) {
      console.warn("fetchStoreBySlug no data", { slug });
      return null;
    }

    return mapDbStoreToStore(data as DbStore);
  } catch (error) {
    console.error("fetchStoreBySlug exception", { slug, error });
    return null;
  }
}

export async function fetchStoreBySlugAdmin(slug: string): Promise<Store | null> {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    return mapDbStoreToStore(data as DbStore);
  } catch {
    return null;
  }
}

export async function createStore(data: {
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  hero_title?: string;
  hero_description?: string;
  published?: boolean;
}): Promise<{ success: boolean; error?: string; store?: Store }> {
  try {
    const { data: store, error } = await supabase
      .from("stores")
      .insert({
        owner_id: data.owner_id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        logo: data.logo || null,
        hero_title: data.hero_title || null,
        hero_description: data.hero_description || null,
        published: data.published ?? false,
      })
      .select()
      .single();

    if (error || !store) {
      return {
        success: false,
        error: error?.message || "Failed to create store. Please try again.",
      };
    }

    return {
      success: true,
      store: mapDbStoreToStore(store as DbStore),
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function updateStore(
  id: string,
  data: Partial<Pick<Store, "name" | "description" | "logo" | "slug" | "heroTitle" | "heroDescription" | "published">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const dbData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) dbData.name = data.name;
    if (data.description !== undefined) dbData.description = data.description || null;
    if (data.logo !== undefined) dbData.logo = data.logo || null;
    if (data.slug !== undefined) dbData.slug = data.slug;
    if (data.heroTitle !== undefined) dbData.hero_title = data.heroTitle || null;
    if (data.heroDescription !== undefined) dbData.hero_description = data.heroDescription || null;
    if (data.published !== undefined) dbData.published = data.published;

    const { error } = await supabase
      .from("stores")
      .update(dbData)
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update store. Please try again.",
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
