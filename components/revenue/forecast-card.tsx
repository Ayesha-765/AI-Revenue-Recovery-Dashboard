import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock } from "lucide-react";

interface ForecastData {
  month: string;
  projected: number;
  optimistic: number;
  conservative: number;
}

interface ForecastCardProps {
  title?: string;
  expectedRevenue?: string;
  projectedGrowth?: string;
  confidenceLevel?: string;
  className?: string;
}

const defaultData: ForecastData[] = [
  { month: "Jan", projected: 52000, optimistic: 56000, conservative: 48000 },
  { month: "Feb", projected: 54000, optimistic: 59000, conservative: 50000 },
  { month: "Mar", projected: 58000, optimistic: 64000, conservative: 53000 },
  { month: "Apr", projected: 60000, optimistic: 67000, conservative: 55000 },
  { month: "May", projected: 63000, optimistic: 71000, conservative: 58000 },
  { month: "Jun", projected: 65000, optimistic: 74000, conservative: 60000 },
];

function ForecastCard({
  title = "Revenue Forecast",
  expectedRevenue = "$65,000",
  projectedGrowth = "+18.5%",
  confidenceLevel = "92%",
  className,
}: ForecastCardProps) {
  return (
    <Card padding="default" className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
          <p className="text-sm text-[#6B7280]">
            AI-powered revenue projection for the next 6 months
          </p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <Target className="h-3 w-3" />
          {confidenceLevel} confidence
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#7C5CFC]" />
            <p className="text-xs text-[#6B7280]">Expected Revenue</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#1A1A1A]">
            {expectedRevenue}
          </p>
          <p className="mt-1 text-xs text-[#00C48C] font-medium">
            {projectedGrowth} projected growth
          </p>
        </div>
        <div className="rounded-[14px] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#00C48C]" />
            <p className="text-xs text-[#6B7280]">Optimistic Scenario</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#1A1A1A]">$74,000</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            If all recommendations are implemented
          </p>
        </div>
        <div className="rounded-[14px] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FFB800]" />
            <p className="text-xs text-[#6B7280]">Conservative Scenario</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#1A1A1A]">$60,000</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            If no changes are made
          </p>
        </div>
      </div>

      <div className="mt-6">
        <svg viewBox="0 0 600 200" className="w-full" style={{ height: 180 }}>
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
            </linearGradient>
          </defs>

          {[48000, 52000, 56000, 60000, 64000, 68000].map((y, i) => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 28}
              x2="580"
              y2={40 + i * 28}
              stroke="#E8ECF3"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
            <text
              key={i}
              x={40 + i * 108}
              y="190"
              textAnchor="middle"
              className="text-xs fill-[#6B7280]"
              style={{ fontSize: 11 }}
            >
              {month}
            </text>
          ))}

          <path
            d={`M ${40 + 0 * 108} ${140 - (defaultData[0].projected - 48000) / 20000 * 100} 
                L ${40 + 1 * 108} ${140 - (defaultData[1].projected - 48000) / 20000 * 100} 
                L ${40 + 2 * 108} ${140 - (defaultData[2].projected - 48000) / 20000 * 100} 
                L ${40 + 3 * 108} ${140 - (defaultData[3].projected - 48000) / 20000 * 100} 
                L ${40 + 4 * 108} ${140 - (defaultData[4].projected - 48000) / 20000 * 100} 
                L ${40 + 5 * 108} ${140 - (defaultData[5].projected - 48000) / 20000 * 100}`}
            fill="none"
            stroke="#7C5CFC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {defaultData.map((d, i) => (
            <circle
              key={i}
              cx={40 + i * 108}
              cy={140 - (d.projected - 48000) / 20000 * 100}
              r="3"
              fill="#FFFFFF"
              stroke="#7C5CFC"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </Card>
  );
}

export { ForecastCard, type ForecastData, type ForecastCardProps };
