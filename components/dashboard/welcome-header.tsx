"use client";

import * as React from "react";
import { useAuth } from "@/components/auth/auth-provider";

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function WelcomeHeader() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Welcome back</h1>
          <span className="text-xl">👋</span>
        </div>
        <p className="text-sm text-[#6B7280]">
          Here&apos;s what&apos;s happening in your business today.
        </p>
      </div>
    );
  }

  const rawName = user.name || user.email?.split("@")[0] || "User";
  const displayName = toTitleCase(rawName);

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
