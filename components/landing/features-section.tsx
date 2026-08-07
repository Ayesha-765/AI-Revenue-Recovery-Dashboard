import * as React from "react";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Truck, 
  FileText 
} from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Revenue Intelligence",
    description: "Track revenue trends and identify patterns that impact your bottom line.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Get intelligent recommendations powered by machine learning algorithms.",
  },
  {
    icon: AlertTriangle,
    title: "Problem Detection",
    description: "Automatically detect checkout abandonment, refunds, and fulfillment issues.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Recovery",
    description: "Recover lost revenue with targeted campaigns and optimizations.",
  },
  {
    icon: BarChart3,
    title: "Product Analytics",
    description: "Understand which products drive revenue and which ones need attention.",
  },
  {
    icon: Users,
    title: "Customer Analytics",
    description: "Analyze customer behavior to improve retention and lifetime value.",
  },
  {
    icon: Truck,
    title: "Order Intelligence",
    description: "Monitor order status, fulfillment, and delivery performance.",
  },
  {
    icon: FileText,
    title: "Smart Reports",
    description: "Generate automated reports that help you make data-driven decisions.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            Everything you need to recover revenue
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Powerful features designed to help ecommerce store owners identify and fix revenue leaks.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              hoverable
              padding="default"
              className="group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10 mb-4 group-hover:bg-[#7C5CFC]/20 transition-colors">
                <feature.icon className="h-6 w-6 text-[#7C5CFC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };
