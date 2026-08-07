import * as React from "react";
import Link from "next/link";

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#1A1A1A] transition-colors"
    >
      {children}
    </a>
  );
}

function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Benefits", href: "#benefits" },
      { name: "FAQ", href: "#faq" },
      { name: "Pricing", href: "#pricing" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Support", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-[#E8ECF3] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="AI Revenue"
                className="h-14 w-auto"
              />
              <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">
                AI Revenue
              </span>
            </div>
            <p className="text-sm text-[#6B7280] max-w-xs leading-relaxed">
              AI-powered revenue recovery platform helping ecommerce store owners identify and fix revenue leaks.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <SocialIcon href="#" label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="GitHub">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </SocialIcon>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8ECF3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} AI Revenue Recovery. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
