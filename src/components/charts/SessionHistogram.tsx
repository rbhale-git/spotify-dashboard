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

export default function SessionHistogram() {
  const data = sessions.length_distribution;

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Session Length Distribution
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
          <XAxis
            dataKey="bucket"
            tick={{ fill: "#BBBBD0", fontSize: 12, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={{ stroke: "#1a1a2e" }}
          />
          <YAxis
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [typeof value === "number" ? value.toLocaleString() : value, "Sessions"]}
          />
          <Bar dataKey="count" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
