import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/store/store-layout";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGrid } from "@/components/store/product-grid";
import { fetchStoreBySlug, fetchStoreBySlugAdmin } from "@/lib/supabase/stores";
import { fetchActiveProductsByStore } from "@/lib/supabase/products";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  let store = await fetchStoreBySlug(slug);

  if (!store) {
    console.warn("Public published store not found, trying admin lookup for debugging", { slug });
    store = await fetchStoreBySlugAdmin(slug);
  }

  if (!store) {
    console.error("Public store not found or not published", { slug });
    notFound();
  }

  if (!store.published) {
    console.warn("Public store found but not published", { slug, storeId: store.id });
    notFound();
  }

  const products = await fetchActiveProductsByStore(store.id);

  return (
    <StoreLayout store={store}>
      <StoreHero store={store} />
      <ProductGrid
        products={products}
        title="Our Products"
        description="Browse our collection of products."
      />
    </StoreLayout>
  );
}
