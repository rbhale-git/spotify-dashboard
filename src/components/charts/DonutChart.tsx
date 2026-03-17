"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { overview } from "@/lib/data";

// Distinct, high-contrast colors — not all greens
const COLORS = ["#1ED760", "#4ECDC4", "#FFD93D", "#FF6B6B", "#8b5cf6", "#06b6d4", "#ec4899"];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function DonutChart() {
  const data = overview.platform_breakdown;

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Platform Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="streams"
            nameKey="platform"
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [
              typeof value === "number" ? `${value.toLocaleString()} streams` : String(value),
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            formatter={(value) => (
              <span style={{ color: "#BBBBD0", fontSize: 12, fontFamily: "Outfit" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
