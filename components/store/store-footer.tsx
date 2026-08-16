"use client";

import * as React from "react";

function StoreFooter() {
  return (
    <footer className="border-t border-[#E8ECF3] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-[#6B7280]">
            Powered by AI Revenue
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { StoreFooter };
