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
import { recommendations } from "@/lib/data";

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
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function GenreTimeline() {
  const data = recommendations.genre_timeline;

  // Get genre cluster keys (all keys except "month")
  const genreKeys = Object.keys(data[0] ?? {}).filter((k) => k !== "month");

  // Shorten labels
  const shortLabels: Record<string, string> = {};
  for (const key of genreKeys) {
    shortLabels[key] = key.split(",")[0].trim();
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Genre Cluster Mix Over Time
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#4A4A62", fontSize: 9, fontFamily: "Outfit" }}
            tickLine={false}
            interval={11}
          />
          <YAxis
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
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
              <span style={{ color: "#8B8BA3", fontSize: 10, fontFamily: "Outfit" }}>
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
