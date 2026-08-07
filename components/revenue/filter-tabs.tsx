import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  tabs: { label: string; value: string }[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-[14px] border border-[#E8ECF3] bg-white p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "rounded-[10px] px-4 py-2 text-sm font-medium transition-all duration-200",
            activeTab === tab.value
              ? "bg-[#7C5CFC] text-white shadow-sm"
              : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F1F5F9]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { FilterTabs, type FilterTabsProps };
