"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/store/product-card";
import type { Product } from "@/data/stores";

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
}

function ProductGrid({ products, title, description }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section id="products" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card padding="default" className="text-center">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">No products yet</h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Check back soon for new arrivals.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
            )}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProductGrid, type ProductGridProps };
