import * as React from "react";
import { Card } from "@/components/ui/card";
import { 
  Plug, 
  Search, 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Plug,
    title: "Connect Your Store",
    description: "Integrate your Shopify, WooCommerce, or BigCommerce store in minutes. No technical expertise required.",
  },
  {
    number: "02",
    icon: Search,
    title: "AI Analyzes Your Business",
    description: "Our AI continuously monitors your store performance, customer behavior, and revenue patterns.",
  },
  {
    number: "03",
    icon: AlertTriangle,
    title: "Revenue Problems Detected",
    description: "Get instant alerts when AI identifies checkout abandonment, refund spikes, or inventory issues.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Receive Recommendations",
    description: "Get actionable recommendations to fix issues and recover lost revenue before it impacts your business.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Get started in minutes and start recovering lost revenue immediately.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card hoverable padding="default" className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-[#7C5CFC]/20">{step.number}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10">
                    <step.icon className="h-5 w-5 text-[#7C5CFC]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {step.description}
                </p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="h-8 w-8 flex items-center justify-center">
                    <div className="h-0.5 w-4 bg-[#E8ECF3]" />
                    <svg className="h-4 w-4 text-[#E8ECF3] -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { HowItWorks };
