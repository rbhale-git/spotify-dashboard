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

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function SkipTrend() {
  const data = sessions.skip_trend.map((d) => ({
    month: d.month,
    skipPct: Math.round(d.skip_rate * 100),
  }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Skip Rate Over Time
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            interval={11}
            axisLine={{ stroke: "#1a1a2e" }}
          />
          <YAxis
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
            width={45}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [`${value}%`, "Skip Rate"]}
          />
          <Line
            type="monotone"
            dataKey="skipPct"
            stroke="#FF6B6B"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
