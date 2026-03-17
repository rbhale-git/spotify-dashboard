"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { deepCuts } from "@/lib/data";

export default function DiversityLine() {
  const data = deepCuts.diversity_index.map((d) => ({
    month: d.month,
    index: d.index,
  }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Music Diversity Index (Shannon Entropy)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            domain={[2, 9]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [value, "Diversity Index"]}
          />
          <Line
            type="monotone"
            dataKey="index"
            stroke="#1DB954"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
