import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductDetails } from "@/components/store/product-details";
import { fetchStoreBySlug } from "@/lib/supabase/stores";
import { fetchActiveProductsByStore } from "@/lib/supabase/products";

interface ProductPageProps {
  params: { slug: string; id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const store = await fetchStoreBySlug(params.slug);

  if (!store) {
    notFound();
  }

  const allProducts = await fetchActiveProductsByStore(store.id);
  const product = allProducts.find((p) => p.id === params.id) ?? null;

  if (!product) {
    notFound();
  }

  return (
    <StoreLayout store={store}>
      <ProductDetails product={product} />
    </StoreLayout>
  );
}
