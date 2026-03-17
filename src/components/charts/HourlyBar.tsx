"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { habits } from "@/lib/data";

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function HourlyBar() {
  const data = habits.hourly_distribution.map((d) => ({
    hour:
      d.hour === 0
        ? "12a"
        : d.hour < 12
          ? `${d.hour}a`
          : d.hour === 12
            ? "12p"
            : `${d.hour - 12}p`,
    streams: d.streams,
  }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Streams by Hour of Day
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            interval={2}
            axisLine={{ stroke: "#1a1a2e" }}
          />
          <YAxis
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="streams" fill="#1ED760" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
