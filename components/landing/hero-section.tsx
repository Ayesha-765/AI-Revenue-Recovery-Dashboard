"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  onSignUpClick?: () => void;
}

function HeroSection({ onSignUpClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFC]/5 via-[#F8FAFC] to-[#74B9FF]/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#7C5CFC]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#74B9FF]/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8ECF3] bg-white px-4 py-1.5 text-sm font-medium text-[#6B7280] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#00C48C] animate-pulse" />
              AI-Powered Revenue Recovery
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
              Recover lost revenue{" "}
              <span className="text-[#7C5CFC]">before it impacts</span> your business
            </h1>

            <p className="text-lg text-[#6B7280] leading-relaxed max-w-xl">
              AI Revenue Recovery continuously monitors your ecommerce store, detects revenue leaks, and provides intelligent recommendations to help you recover lost sales.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" onClick={onSignUpClick}>
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="h-4 w-4" />
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-[#F1F5F9] flex items-center justify-center text-xs font-medium text-[#6B7280]"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-[#1A1A1A]">2,500+ store owners</p>
                <p className="text-[#6B7280]">trust AI Revenue Recovery</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#7C5CFC]/20 to-[#74B9FF]/20 rounded-[24px] blur-2xl" />
              <div className="relative rounded-[20px] border border-[#E8ECF3] bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Total Revenue</p>
                    <p className="text-3xl font-bold text-[#1A1A1A]">$48,352</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#00C48C]/10 px-3 py-1">
                    <span className="text-sm font-semibold text-[#00C48C]">+12.5%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-[14px] border border-[#E8ECF3] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FF5C5C]/10">
                        <span className="text-lg">⚠️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">Checkout Abandonment</p>
                        <p className="text-xs text-[#6B7280]">Mobile users dropping off</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#FF5C5C]">-$3,240/mo</span>
                  </div>

                  <div className="flex items-center justify-between rounded-[14px] border border-[#E8ECF3] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10">
                        <span className="text-lg">✨</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">AI Recommendation</p>
                        <p className="text-xs text-[#6B7280]">Improve mobile checkout</p>
                      </div>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>

                  <div className="flex items-center justify-between rounded-[14px] border border-[#E8ECF3] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#00C48C]/10">
                        <span className="text-lg">📈</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">Revenue Recovery</p>
                        <p className="text-xs text-[#6B7280]">This month</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#00C48C]">+$8,420</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
