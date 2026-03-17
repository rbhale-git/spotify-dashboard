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
  "#1DB954",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

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
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Genre Cluster Mix Over Time</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6a6a6a", fontSize: 9 }}
            tickLine={false}
            interval={11}
          />
          <YAxis
            tick={{ fill: "#6a6a6a", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [
              typeof value === "number" ? `${(value * 100).toFixed(1)}%` : value,
            ]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#b3b3b3", fontSize: 10 }}>{shortLabels[value] ?? value}</span>
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
