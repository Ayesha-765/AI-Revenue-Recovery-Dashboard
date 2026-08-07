import * as React from "react";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface TopNavbarProps {
  onMenuClick?: () => void;
}

function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [notifications] = React.useState(3);

  return (
    <div className="flex h-16 items-center justify-between border-b border-[#E8ECF3] bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img
          src="/logo.png"
          alt="AI Revenue"
          className="h-12 w-auto hidden md:block"
        />
        <div className="hidden md:flex items-center gap-2 text-sm text-[#6B7280]">
          <span>Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search anything..."
            className="w-64"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] transition-colors">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5C5C] text-[10px] font-medium text-white">
              {notifications}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-[#E8ECF3]">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-[#1A1A1A]">Alex Morgan</p>
            <p className="text-xs text-[#6B7280]">Store Owner</p>
          </div>
          <Avatar
            src=""
            alt="Alex Morgan"
            fallback="AM"
            size="default"
            className="border-2 border-white shadow-sm"
          />
          <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9]">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { TopNavbar };
