import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Settings,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Revenue Problems", href: "/dashboard/problems", icon: AlertTriangle },
  { name: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function Sidebar({
  className,
  isCollapsed = false,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-6">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="AI Revenue"
              className="h-14 w-auto"
            />
            <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">
              AI Revenue
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <img
              src="/logo.png"
              alt="AI Revenue"
              className="h-14 w-auto"
            />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#7C5CFC] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#1A1A1A]",
                isCollapsed && "justify-center px-2"
              )}
              onClick={onMobileClose}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-[#6B7280] group-hover:text-[#1A1A1A]"
                )}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E8ECF3] p-3">
        {!isCollapsed && (
          <div className="rounded-[14px] bg-[#7C5CFC]/5 p-4">
            <p className="text-xs font-medium text-[#7C5CFC]">
              Upgrade to Pro
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Unlock advanced AI insights
            </p>
            <button className="mt-3 w-full rounded-[14px] bg-[#7C5CFC] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#6B4BE0]">
              Upgrade
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex h-screen w-64 shrink-0 flex-col border-r border-[#E8ECF3] bg-white transition-all duration-300",
          isCollapsed && "w-20",
          className
        )}
      >
        {sidebarContent}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-[#E8ECF3] bg-white shadow-sm lg:flex hover:bg-[#F8FAFC]"
        >
          <ChevronLeft
            className={cn(
              "h-3 w-3 text-[#6B7280] transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          isMobileOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onMobileClose}
        />
        <div className="fixed inset-y-0 left-0 w-64 border-r border-[#E8ECF3] bg-white shadow-xl">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}

export { Sidebar, type SidebarProps };
