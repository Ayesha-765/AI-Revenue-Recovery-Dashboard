import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[10px] px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#7C5CFC]/10 text-[#7C5CFC]",
        secondary:
          "bg-[#F1F5F9] text-[#6B7280]",
        success:
          "bg-[#00C48C]/10 text-[#00C48C]",
        warning:
          "bg-[#FFB800]/10 text-[#D4A000]",
        danger:
          "bg-[#FF5C5C]/10 text-[#FF5C5C]",
        info:
          "bg-[#4F8CFF]/10 text-[#4F8CFF]",
        outline:
          "border border-[#E8ECF3] text-[#6B7280]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
