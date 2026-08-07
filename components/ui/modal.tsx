"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={contentRef}
        className={cn(
          "relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[20px] bg-white shadow-xl",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 z-10 flex h-8 w-8 items-center justify-center rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#1A1A1A] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Modal, type ModalProps };
