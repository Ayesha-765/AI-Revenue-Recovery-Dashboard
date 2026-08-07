import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#7C5CFC] to-[#6B4BE0] px-8 py-16 sm:px-16 sm:py-24 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white mb-6">
              <Sparkles className="h-4 w-4" />
              Start recovering revenue today
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl lg:text-5xl">
              Ready to recover lost revenue?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of ecommerce store owners who are already using AI Revenue Recovery to identify and fix revenue leaks.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                Book a Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/60">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTASection };
