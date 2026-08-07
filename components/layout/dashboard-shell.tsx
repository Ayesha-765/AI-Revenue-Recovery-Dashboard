"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

function DashboardShell({ children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export { DashboardShell };
