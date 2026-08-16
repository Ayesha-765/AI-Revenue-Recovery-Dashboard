"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Store } from "@/data/stores";

interface StoreNavbarProps {
  store: Store;
  cartItemCount: number;
}

function StoreNavbar({ store, cartItemCount }: StoreNavbarProps) {
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const storeSlug = slug ?? store.slug;

  const navLinks = [
    { name: "Home", href: `/store/${storeSlug}` },
    { name: "Products", href: `/store/${storeSlug}` },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8ECF3] bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href={`/store/${storeSlug}`}
              className="flex items-center gap-2.5"
            >
              {store.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={store.logo}
                  alt={store.name}
                  className="h-8 w-8 rounded-[10px] object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#7C5CFC] text-sm font-bold text-white">
                  {store.name.charAt(0)}
                </div>
              )}
              <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">
                {store.name}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "rounded-[10px] px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                        : "text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#1A1A1A]"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/store/${storeSlug}/cart`}>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#7C5CFC] text-xs font-medium text-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export { StoreNavbar };
