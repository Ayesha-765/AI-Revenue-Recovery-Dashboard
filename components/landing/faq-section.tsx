"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is AI Revenue Recovery?",
    answer: "AI Revenue Recovery is an intelligent platform that continuously monitors your ecommerce store, detects revenue leaks, and provides actionable recommendations to help you recover lost sales and grow your business.",
  },
  {
    question: "How does the AI detect revenue problems?",
    answer: "Our AI analyzes your store data in real-time, monitoring metrics like checkout abandonment, refund rates, inventory levels, and customer behavior patterns to identify issues that impact revenue.",
  },
  {
    question: "Which platforms do you support?",
    answer: "We currently support Shopify, WooCommerce, and BigCommerce. We're constantly adding new integrations based on customer demand.",
  },
  {
    question: "How long does it take to set up?",
    answer: "Setup takes less than 5 minutes. Simply connect your store, and our AI will immediately start analyzing your data and providing insights.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We never share your data with third parties, and you can delete your data at any time.",
  },
  {
    question: "What kind of ROI can I expect?",
    answer: "Most customers recover 3-10x their investment in the first month. Our AI typically identifies revenue opportunities worth thousands of dollars that would otherwise go unnoticed.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-32 bg-[#F8FAFC]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Everything you need to know about AI Revenue Recovery.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              padding="none"
              className="overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="text-base font-semibold text-[#1A1A1A]">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-[#6B7280] transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-6 pb-6 text-sm text-[#6B7280] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FAQSection };
