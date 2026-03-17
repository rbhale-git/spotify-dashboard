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
import { sessions } from "@/lib/data";

export default function SkipTrend() {
  const data = sessions.skip_trend.map((d) => ({
    month: d.month,
    skipPct: Math.round(d.skip_rate * 100),
  }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Skip Rate Over Time (%)</h3>
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
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [`${value}%`, "Skip Rate"]}
          />
          <Line
            type="monotone"
            dataKey="skipPct"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
