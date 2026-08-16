import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/store/store-layout";
import { StoreHero } from "@/components/store/store-hero";
import { ProductGrid } from "@/components/store/product-grid";
import { mockStores, mockStoreProducts } from "@/data/stores";

interface StorePageProps {
  params: { slug: string };
}

function getStore(slug: string) {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

function getStoreProducts(storeId: string) {
  return mockStoreProducts.filter((product) => product.storeId === storeId && product.active);
}

export function generateStaticParams() {
  return mockStores.map((store) => ({ slug: store.slug }));
}

export default function StorePage({ params }: StorePageProps) {
  const store = getStore(params.slug);

  if (!store) {
    notFound();
  }

  const products = getStoreProducts(store.id);

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
