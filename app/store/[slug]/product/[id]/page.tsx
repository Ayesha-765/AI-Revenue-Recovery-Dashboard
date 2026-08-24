import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductDetails } from "@/components/store/product-details";
import { fetchStoreBySlug, fetchStoreBySlugAdmin } from "@/lib/supabase/stores";
import { fetchActiveProductsByStore } from "@/lib/supabase/products";

interface ProductPageProps {
  params: Promise<{ slug: string; id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, id } = await params;

  let store = await fetchStoreBySlug(slug);

  if (!store) {
    store = await fetchStoreBySlugAdmin(slug);
  }

  if (!store || !store.published) {
    notFound();
  }

  const products = await fetchActiveProductsByStore(store.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <StoreLayout store={store}>
      <ProductDetails product={product} />
    </StoreLayout>
  );
}
