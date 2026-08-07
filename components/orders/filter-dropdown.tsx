import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

function FilterDropdown({
  label,
  options,
  value,
  onValueChange,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-[14px] border border-[#E8ECF3] bg-white px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
      >
        {selectedLabel}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-[14px] border border-[#E8ECF3] bg-white shadow-lg">
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-[10px] px-3 py-2 text-left text-sm transition-colors",
                    value === option.value
                      ? "bg-[#7C5CFC]/10 text-[#7C5CFC] font-medium"
                      : "text-[#6B7280] hover:bg-[#F1F5F9]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { FilterDropdown, type FilterDropdownProps };
