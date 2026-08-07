import * as React from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    content: "AI Revenue Recovery helped us recover $15,000 in lost revenue in the first month. The AI insights are incredibly accurate and actionable.",
    author: "Sarah Johnson",
    role: "Ecommerce Manager",
    company: "TechStyle Store",
    initials: "SJ",
  },
  {
    content: "We were losing money to checkout abandonment and didn't even know it. The platform detected the issue and gave us clear steps to fix it.",
    author: "Michael Chen",
    role: "Founder",
    company: "GearUp Sports",
    initials: "MC",
  },
  {
    content: "The dashboard is beautiful and intuitive. It feels like having a revenue recovery expert working for you 24/7.",
    author: "Emily Davis",
    role: "Operations Director",
    company: "Home Essentials Co.",
    initials: "ED",
  },
  {
    content: "We've reduced refunds by 40% and increased our revenue by 25% since using AI Revenue Recovery. Absolutely worth it.",
    author: "James Wilson",
    role: "CEO",
    company: "Digital Goods Inc.",
    initials: "JW",
  },
  {
    content: "The AI recommendations are spot on. We implemented the mobile checkout fix and saw immediate results.",
    author: "Lisa Anderson",
    role: "Marketing Lead",
    company: "Fashion Forward",
    initials: "LA",
  },
  {
    content: "Finally, a tool that focuses on revenue recovery instead of just vanity metrics. This is exactly what ecommerce needs.",
    author: "David Brown",
    role: "Store Owner",
    company: "Brown's Boutique",
    initials: "DB",
  },
];

function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight sm:text-4xl">
            Trusted by store owners worldwide
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            See what our customers have to say about recovering revenue with AI.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              hoverable
              padding="default"
              className="flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 mb-6">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8ECF3]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-sm font-medium text-[#7C5CFC]">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{testimonial.author}</p>
                  <p className="text-xs text-[#6B7280]">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Testimonials };
