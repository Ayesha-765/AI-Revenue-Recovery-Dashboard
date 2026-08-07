import * as React from "react";
import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  RefreshCw, 
  MessageSquare, 
  Search 
} from "lucide-react";

const problems = [
  {
    icon: ShoppingCart,
    title: "Checkout Abandonment",
    description: "Customers leave without completing purchases, costing you thousands in lost revenue every month.",
  },
  {
    icon: DollarSign,
    title: "Unexpected Revenue Drops",
    description: "Sales decline suddenly and you don't know why until it's too late to act.",
  },
  {
    icon: Truck,
    title: "Fulfillment Issues",
    description: "Shipping delays and inventory stockouts create bad customer experiences.",
  },
  {
    icon: RefreshCw,
    title: "Refund Spikes",
    description: "Increasing refunds erode your margins and hurt customer lifetime value.",
  },
  {
    icon: MessageSquare,
    title: "Unanswered Questions",
    description: "Customer support tickets pile up while issues affecting revenue go unresolved.",
  },
  {
    icon: Search,
    title: "Marketing Waste",
    description: "Ad spend doesn't convert because the right customers aren't finding your products.",
  },
];

function ProblemSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            Are these revenue leaks hurting your store?
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Every day without action is another day of lost revenue. Here are the most common problems ecommerce store owners face.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <Card
              key={index}
              hoverable
              padding="default"
              className="group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10 mb-4 group-hover:bg-[#7C5CFC]/20 transition-colors">
                <problem.icon className="h-6 w-6 text-[#7C5CFC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {problem.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProblemSection };
