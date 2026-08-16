import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/store/store-layout";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGrid } from "@/components/store/product-grid";
import { fetchStoreBySlug } from "@/lib/supabase/stores";
import { fetchActiveProductsByStore } from "@/lib/supabase/products";

interface StorePageProps {
  params: { slug: string };
}

export default async function StorePage({ params }: StorePageProps) {
  const store = await fetchStoreBySlug(params.slug);

  if (!store) {
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
