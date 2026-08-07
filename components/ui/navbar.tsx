import * as React from "react";
import { cn } from "@/lib/utils";

function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[#E8ECF3] bg-white/80 backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
Navbar.displayName = "Navbar";

export { Navbar };
