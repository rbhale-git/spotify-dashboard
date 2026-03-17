"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { habits } from "@/lib/data";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Distinct colors per year — easy to tell apart
const YEAR_COLORS: Record<number, string> = {
  2018: "#8b5cf6",
  2019: "#06b6d4",
  2020: "#ec4899",
  2021: "#FFD93D",
  2022: "#FF6B6B",
  2023: "#4ECDC4",
  2024: "#f97316",
  2025: "#84cc16",
  2026: "#1ED760",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function SeasonalOverlay() {
  const rawData = habits.seasonal_overlay;
  const years = [...new Set(rawData.map((d) => d.year))].sort();
  const latestYear = Math.max(...years);

  const monthData = Array.from({ length: 12 }, (_, i) => {
    const entry: Record<string, number | string> = { month: MONTH_NAMES[i] };
    for (const year of years) {
      const found = rawData.find((d) => d.month_of_year === i + 1 && d.year === year);
      if (found) entry[String(year)] = found.hours;
    }
    return entry;
  });

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Seasonal Listening by Year
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={monthData} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#9999B0", fontSize: 12, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={{ stroke: "#1a1a2e" }}
          />
          <YAxis
            tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#BBBBD0", fontSize: 12, fontFamily: "Outfit", fontWeight: 500 }}>{value}</span>
            )}
          />
          {years.map((year) => (
            <Line
              key={year}
              type="monotone"
              dataKey={String(year)}
              stroke={YEAR_COLORS[year] ?? "#1ED760"}
              strokeWidth={year === latestYear ? 3 : 1.5}
              opacity={year === latestYear ? 1 : 0.6}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
