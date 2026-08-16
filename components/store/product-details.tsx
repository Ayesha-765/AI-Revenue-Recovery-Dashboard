"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import type { Product } from "@/data/stores";

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
      >
        ← Back to store
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-[18px] border border-[#E8ECF3] bg-[#F1F5F9]">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full max-h-[500px] object-contain rounded-[18px]"
            />
          ) : (
            <span className="text-8xl font-bold text-[#6B7280]">
              {product.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {product.name}
          </h1>
          <p className="mt-4 text-base text-[#6B7280]">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-[#1A1A1A]">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-[#6B7280]">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-[14px] border border-[#E8ECF3]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
                >
                  -
                </button>
                <span className="flex h-11 w-12 items-center justify-center text-sm font-medium text-[#1A1A1A] border-x border-[#E8ECF3]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={added}
                className="flex-1 sm:flex-none"
              >
                {added ? "Added!" : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
              </Button>
            </div>
          )}

          {added && (
            <p className="mt-3 text-sm text-[#00C48C]">
              Added to cart successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { ProductDetails };
