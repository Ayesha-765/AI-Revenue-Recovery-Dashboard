import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

function SolutionSection() {
  return (
    <section className="py-20 lg:py-32 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8ECF3] bg-white px-4 py-1.5 text-sm font-medium text-[#7C5CFC] shadow-sm">
              <Sparkles className="h-4 w-4" />
              The Solution
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
              AI that watches your store 24/7
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              AI Revenue Recovery continuously monitors your store performance, detects revenue leaks before they become serious problems, and provides actionable recommendations to help you recover lost sales.
            </p>

            <div className="space-y-4">
              {[
                "Real-time monitoring of store performance",
                "AI-powered detection of revenue leaks",
                "Actionable recommendations to fix issues",
                "Revenue forecasting and recovery tracking",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00C48C]/10 mt-0.5">
                    <svg className="h-3.5 w-3.5 text-[#00C48C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard">
              <Button size="lg" className="mt-4">
                See How It Works
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#7C5CFC]/10 to-[#74B9FF]/10 rounded-[24px] blur-2xl" />
            <Card padding="lg" className="relative">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#7C5CFC] shadow-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">AI Analysis Complete</h3>
                    <p className="text-sm text-[#6B7280]">3 revenue opportunities found</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Mobile Checkout", impact: "+$3,240/mo", status: "Critical" },
                    { title: "Product Search", impact: "+$1,850/mo", status: "High" },
                    { title: "Email Campaigns", impact: "+$980/mo", status: "Medium" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-[14px] border border-[#E8ECF3] p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{item.title}</p>
                        <p className="text-xs text-[#6B7280]">{item.status} priority</p>
                      </div>
                      <span className="text-sm font-semibold text-[#00C48C]">{item.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SolutionSection };
