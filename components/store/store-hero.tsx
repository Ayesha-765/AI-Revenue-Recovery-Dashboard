"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Store } from "@/data/stores";

interface StoreHeroProps {
  store: Store;
}

function StoreHero({ store }: StoreHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            {store.heroTitle || `Welcome to ${store.name}`}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280]">
            {store.heroDescription || store.description}
          </p>
          <div className="mt-8">
            <Link href={`#products`}>
              <Button size="lg">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C5CFC]/5 via-transparent to-[#74B9FF]/5" />
    </section>
  );
}

export { StoreHero };
