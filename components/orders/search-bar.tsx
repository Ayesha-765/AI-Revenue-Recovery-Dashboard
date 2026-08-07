import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

function SearchBar({
  placeholder = "Search orders...",
  value,
  onValueChange,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-[14px] border border-[#E8ECF3] bg-white pl-10 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#6B7280] transition-all duration-200 hover:border-[#7C5CFC]/40 focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20"
      />
    </div>
  );
}

export { SearchBar, type SearchBarProps };
