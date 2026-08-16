"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/auth-provider";

function WelcomeHeader() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
          Welcome back, {displayName}
        </h1>
        <span className="text-xl">👋</span>
      </div>
      <p className="text-sm text-[#6B7280]">
        Here&apos;s what&apos;s happening in your business today.
      </p>
    </div>
  );
}

export { WelcomeHeader };
