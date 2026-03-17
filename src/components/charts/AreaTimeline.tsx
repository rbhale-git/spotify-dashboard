"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { overview } from "@/lib/data";

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function AreaTimeline() {
  const data = overview.monthly_volume.map((d) => ({
    ...d,
    label: d.month.slice(0, 7),
  }));

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Monthly Listening Volume
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1ED760" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#1ED760" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            interval={11}
          />
          <YAxis
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [`${value} hrs`, "Hours"]}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#1ED760"
            strokeWidth={2}
            fill="url(#greenGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
