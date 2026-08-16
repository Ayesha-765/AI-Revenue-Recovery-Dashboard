import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductDetails } from "@/components/store/product-details";
import { mockStores, mockStoreProducts } from "@/data/stores";

interface ProductPageProps {
  params: { slug: string; id: string };
}

function getStore(slug: string) {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

function getProduct(storeId: string, productId: string) {
  return mockStoreProducts.find((product) => product.storeId === storeId && product.id === productId) ?? null;
}

export function generateStaticParams() {
  return mockStoreProducts.map((product) => {
    const store = mockStores.find((s) => s.id === product.storeId);
    if (!store) return null;
    return { slug: store.slug, id: product.id };
  }).filter(Boolean) as { slug: string; id: string }[];
}

export default function ProductPage({ params }: ProductPageProps) {
  const store = getStore(params.slug);

  if (!store) {
    notFound();
  }

  const product = getProduct(store.id, params.id);

  if (!product) {
    notFound();
  }

  return (
    <StoreLayout store={store}>
      <ProductDetails product={product} />
    </StoreLayout>
  );
}
