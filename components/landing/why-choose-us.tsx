import * as React from "react";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp, 
  Palette, 
  Clock 
} from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "AI-First Approach",
    description: "Our platform uses advanced AI to detect issues humans miss, providing insights that traditional analytics can't deliver.",
  },
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description: "Get instant alerts when revenue problems are detected, so you can act before it impacts your business.",
  },
  {
    icon: TrendingUp,
    title: "Revenue-Focused",
    description: "Every recommendation is designed to help you recover lost revenue and grow your business.",
  },
  {
    icon: Shield,
    title: "Easy Integration",
    description: "Connect your store in minutes. We support Shopify, WooCommerce, and BigCommerce out of the box.",
  },
  {
    icon: Palette,
    title: "Beautiful Dashboard",
    description: "A premium, intuitive dashboard that makes understanding your revenue simple and actionable.",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Automate revenue monitoring and focus on growing your business instead of analyzing spreadsheets.",
  },
];

function WhyChooseUs() {
  return (
    <section id="benefits" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            Why choose AI Revenue Recovery?
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            We&apos;re not just another analytics tool. We&apos;re your AI-powered revenue recovery partner.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              hoverable
              padding="default"
              className="group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10 mb-4 group-hover:bg-[#7C5CFC]/20 transition-colors">
                <benefit.icon className="h-6 w-6 text-[#7C5CFC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { WhyChooseUs };
