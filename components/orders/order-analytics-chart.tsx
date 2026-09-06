import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartPoint {
  label: string;
  value: number;
}

interface OrderAnalyticsChartProps {
  data: ChartPoint[];
  height?: number;
  className?: string;
}

function OrderAnalyticsChart({
  data,
  height = 280,
  className,
}: OrderAnalyticsChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 800;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (!data || data.length === 0) {
    return (
      <div className={cn("w-full flex items-center justify-center", className)} style={{ height }}>
        <p className="text-sm text-[#6B7280]">No data available</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values) * 1.1;
  const minValue = Math.min(...values) * 0.9;
  const valueRange = maxValue - minValue;

  const safeValueRange = Number.isFinite(valueRange) && valueRange > 0 ? valueRange : 1;
  const safeMinValue = Number.isFinite(minValue) ? minValue : 0;
  const safeMaxValue = Number.isFinite(maxValue) ? maxValue : 100;

  const points = data.map((d, i) => {
    const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2);
    const y = padding.top + chartHeight - ((d.value - safeMinValue) / safeValueRange) * chartHeight;
    return {
      x: Number.isFinite(x) ? x : padding.left,
      y: Number.isFinite(y) ? y : padding.top + chartHeight / 2,
      value: d.value,
      label: d.label,
    };
  });

  const pathD = points
    .map((point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) / 2;
      const cp2y = point.y;
      return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const gridLines = 5;
  const yAxisLabels = Array.from({ length: gridLines }, (_, i) => {
    const value = safeMinValue + (safeValueRange * i) / (gridLines - 1);
    const y = padding.top + chartHeight - (i / (gridLines - 1)) * chartHeight;
    return { value: Math.round(value), y };
  });

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orderChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#74B9FF" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#74B9FF" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yAxisLabels.map((label, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={label.y}
              x2={width - padding.right}
              y2={label.y}
              stroke="#E8ECF3"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 10}
              y={label.y + 4}
              textAnchor="end"
              className="text-xs fill-[#6B7280]"
              style={{ fontSize: 11 }}
            >
              {label.value >= 1000 ? `${(label.value / 1000).toFixed(0)}k` : label.value}
            </text>
          </g>
        ))}

        {points.map((point, i) => (
          <text
            key={`label-${i}`}
            x={point.x}
            y={padding.top + chartHeight + 20}
            textAnchor="middle"
            className="text-xs fill-[#6B7280]"
            style={{ fontSize: 11 }}
          >
            {point.label}
          </text>
        ))}

        <path d={areaD} fill="url(#orderChartGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke="#74B9FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#FFFFFF"
            stroke="#74B9FF"
            strokeWidth="2"
            className="transition-all duration-200"
          />
        ))}
      </svg>
    </div>
  );
}

export { OrderAnalyticsChart, type ChartPoint, type OrderAnalyticsChartProps };
