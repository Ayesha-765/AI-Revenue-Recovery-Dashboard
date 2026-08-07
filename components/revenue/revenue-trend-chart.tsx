import * as React from "react";
import { cn } from "@/lib/utils";

interface ChartPoint {
  label: string;
  value: number;
}

interface RevenueTrendChartProps {
  data: ChartPoint[];
  height?: number;
  className?: string;
}

function RevenueTrendChart({
  data,
  height = 280,
  className,
}: RevenueTrendChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 800;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
  const minValue = Math.min(...data.map((d) => d.value)) * 0.9;
  const valueRange = maxValue - minValue;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight,
    value: d.value,
    label: d.label,
  }));

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
    const value = minValue + (valueRange * i) / (gridLines - 1);
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
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
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
              ${label.value >= 1000 ? `${(label.value / 1000).toFixed(0)}k` : label.value}
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

        <path d={areaD} fill="url(#chartGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke="#7C5CFC"
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
            stroke="#7C5CFC"
            strokeWidth="2"
            className="transition-all duration-200"
          />
        ))}
      </svg>
    </div>
  );
}

export { RevenueTrendChart, type ChartPoint, type RevenueTrendChartProps };
