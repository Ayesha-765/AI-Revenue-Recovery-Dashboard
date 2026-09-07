import * as React from "react";
import { ChevronDown, Menu, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";

interface TopNavbarProps {
  onMenuClick?: () => void;
}

function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

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
        <div className="relative flex items-center gap-3 pl-3 border-l border-[#E8ECF3]">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-[#1A1A1A]">{displayName}</p>
            <p className="text-xs text-[#6B7280]">Store Owner</p>
          </div>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-1"
          >
            <Avatar
              src=""
              alt={displayName}
              fallback={initials}
              size="default"
              className="border-2 border-white shadow-sm"
            />
            <ChevronDown className="hidden sm:block h-4 w-4 text-[#6B7280]" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-[14px] border border-[#E8ECF3] bg-white py-1 shadow-lg">
                <Link
                  href="/dashboard/profile"
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F8FAFC] transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#FF5C5C] hover:bg-[#FF5C5C]/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { TopNavbar };
