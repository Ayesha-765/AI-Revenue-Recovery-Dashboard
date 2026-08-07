import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  ...props
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-[10px]",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-[#F1F5F9]",
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    />
  );
}

export { Skeleton };
