"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Benefits", href: "#benefits" },
  { name: "FAQ", href: "#faq" },
  { name: "Pricing", href: "#pricing" },
];

interface LandingNavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

function LandingNavbar({ onLoginClick, onSignUpClick }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsMobileOpen(false);
    onLoginClick?.();
  };

  const handleSignUpClick = () => {
    setIsMobileOpen(false);
    onSignUpClick?.();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-[#E8ECF3] bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#1A1A1A]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleLoginClick}>
              Login
            </Button>
            <Button size="sm" onClick={handleSignUpClick}>
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] md:hidden"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="border-b border-[#E8ECF3] bg-white md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="rounded-[10px] px-4 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#1A1A1A]"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-center" onClick={handleLoginClick}>
                Login
              </Button>
              <Button className="w-full justify-center" onClick={handleSignUpClick}>
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export { LandingNavbar, type LandingNavbarProps };
