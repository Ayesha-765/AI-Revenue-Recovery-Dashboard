"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import type { Product } from "@/data/stores";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? product.storeId;
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-[18px] border border-[#E8ECF3] bg-white transition-all duration-200 hover:shadow-md hover:border-[#7C5CFC]/20">
      <div className="flex aspect-square w-full items-center justify-center bg-[#F1F5F9]">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-[#6B7280]">
            {product.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#1A1A1A]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-[#6B7280] line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#1A1A1A]">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <Link href={`/store/${slug}/product/${product.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {product.stock <= 0 && (
          <p className="mt-2 text-xs text-[#FF5C5C]">Out of stock</p>
        )}
      </div>
    </div>
  );
}

export { ProductCard, type ProductCardProps };
