"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

function RedirectIfNotAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/?login=1");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8ECF3] border-t-[#7C5CFC]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export { RedirectIfNotAuthenticated };
