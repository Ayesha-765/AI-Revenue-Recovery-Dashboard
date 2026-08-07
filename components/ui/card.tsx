import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
};

function Card({
  className,
  hoverable = false,
  padding = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-[#E8ECF3] bg-white shadow-sm transition-all duration-200",
        hoverable && "hover:shadow-md hover:border-[#7C5CFC]/20 cursor-pointer",
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-[#1A1A1A]", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[#6B7280]", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
