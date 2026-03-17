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

const COLORS = ["#1ED760", "#1aa34a", "#17923f", "#4ECDC4", "#40916c", "#74c69d", "#95d5b2"];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function DonutChart() {
  const data = overview.platform_breakdown;

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Platform Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="streams"
            nameKey="platform"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
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
            formatter={(value) => (
              <span style={{ color: "#8B8BA3", fontSize: 11, fontFamily: "Outfit" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
