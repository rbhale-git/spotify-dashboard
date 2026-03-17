"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GenreTimelineProps {
  data: Record<string, string | number>[];
}

const CLUSTER_COLORS = [
  "#1ED760",
  "#4ECDC4",
  "#FFD93D",
  "#FF6B6B",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function GenreTimeline({ data }: GenreTimelineProps) {
  if (!data || data.length === 0) return null;

  const genreKeys = Object.keys(data[0] ?? {}).filter((k) => k !== "month");

  const shortLabels: Record<string, string> = {};
  for (const key of genreKeys) {
    shortLabels[key] = key.split(",")[0].trim();
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Genre Cluster Mix Over Time
      </h3>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            interval={Math.max(1, Math.floor(data.length / 8))}
            axisLine={{ stroke: "#1a1a2e" }}
          />
          <YAxis
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
            width={50}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [
              typeof value === "number" ? `${(value * 100).toFixed(1)}%` : value,
            ]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#BBBBD0", fontSize: 11, fontFamily: "Outfit" }}>
                {shortLabels[value] ?? value}
              </span>
            )}
          />
          {genreKeys.map((key, idx) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={CLUSTER_COLORS[idx % CLUSTER_COLORS.length]}
              fill={CLUSTER_COLORS[idx % CLUSTER_COLORS.length]}
              fillOpacity={0.7}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
