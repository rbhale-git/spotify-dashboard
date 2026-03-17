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

const COLORS = ["#1DB954", "#1aa34a", "#17923f", "#52b788", "#40916c", "#74c69d", "#95d5b2"];

export default function DonutChart() {
  const data = overview.platform_breakdown;

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Platform Breakdown</h3>
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
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value, name) => [
              typeof value === "number" ? `${value.toLocaleString()} streams` : String(value),
              name,
            ]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#b3b3b3", fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
