import * as React from "react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E8ECF3] px-4 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC] disabled:opacity-50"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[10px] text-sm font-medium transition-all duration-200",
            currentPage === page
              ? "bg-[#7C5CFC] text-white shadow-sm"
              : "border border-[#E8ECF3] text-[#6B7280] hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
          )}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E8ECF3] px-4 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export { Pagination, type PaginationProps };
