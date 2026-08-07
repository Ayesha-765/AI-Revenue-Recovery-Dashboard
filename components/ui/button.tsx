import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#7C5CFC] text-white hover:bg-[#6B4BE0] shadow-sm hover:shadow-md",
        secondary:
          "bg-[#F1F5F9] text-[#1A1A1A] hover:bg-[#E8ECF3]",
        outline:
          "border border-[#E8ECF3] bg-transparent hover:bg-[#F8FAFC]",
        ghost: "hover:bg-[#F1F5F9]",
        destructive:
          "bg-[#FF5C5C] text-white hover:bg-[#E64C4C] shadow-sm hover:shadow-md",
        success:
          "bg-[#00C48C] text-white hover:bg-[#00B37D] shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
