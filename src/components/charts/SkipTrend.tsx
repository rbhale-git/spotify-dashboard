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
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function SkipTrend() {
  const data = sessions.skip_trend.map((d) => ({
    month: d.month,
    skipPct: Math.round(d.skip_rate * 100),
  }));

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Skip Rate Over Time (%)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            domain={[0, 100]}
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
