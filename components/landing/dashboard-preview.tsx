import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertTriangle } from "lucide-react";

function DashboardPreview() {
  return (
    <section className="py-20 lg:py-32 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            A dashboard that works for you
          </h2>
            <p className="mt-4 text-lg text-[#6B7280]">
              See exactly what is happening with your store revenue at a glance.
            </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#7C5CFC]/10 to-[#74B9FF]/10 rounded-[24px] blur-2xl" />
          <Card padding="none" className="relative overflow-hidden">
            <div className="border-b border-[#E8ECF3] bg-white px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FF5C5C]" />
                <div className="h-3 w-3 rounded-full bg-[#FFB800]" />
                <div className="h-3 w-3 rounded-full bg-[#00C48C]" />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-3 mb-8">
                {[
                  { title: "Total Revenue", value: "$48,352", change: "+12.5%", positive: true },
                  { title: "Orders", value: "1,247", change: "+8.2%", positive: true },
                  { title: "Recovered", value: "$8,420", change: "+24.1%", positive: true },
                ].map((stat, index) => (
                  <div key={index} className="rounded-[14px] border border-[#E8ECF3] p-5">
                    <p className="text-sm font-medium text-[#6B7280]">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#1A1A1A] mt-2">{stat.value}</p>
                    <p className={cn("text-sm font-medium mt-1", stat.positive ? "text-[#00C48C]" : "text-[#FF5C5C]")}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-[14px] border border-[#E8ECF3] p-5">
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Revenue Trend</h3>
                  <div className="h-48 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-[8px] bg-[#7C5CFC] opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[14px] border border-[#E8ECF3] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FF5C5C]/10">
                        <AlertTriangle className="h-5 w-5 text-[#FF5C5C]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">Revenue Leaks</p>
                        <p className="text-xs text-[#6B7280]">3 detected</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280]">Estimated loss: $12,400/mo</p>
                  </div>

                  <div className="rounded-[14px] border border-[#E8ECF3] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7C5CFC]/10">
                        <Sparkles className="h-5 w-5 text-[#7C5CFC]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">AI Insights</p>
                        <p className="text-xs text-[#6B7280]">2 new</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280]">Potential recovery: $8,420/mo</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export { DashboardPreview };
