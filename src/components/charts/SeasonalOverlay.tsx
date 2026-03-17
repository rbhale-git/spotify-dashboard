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

const YEAR_COLORS: Record<number, string> = {
  2018: "#1ED760",
  2019: "#17923f",
  2020: "#4ECDC4",
  2021: "#74c69d",
  2022: "#95d5b2",
  2023: "#b7e4c7",
  2024: "#FFD93D",
  2025: "#1aa34a",
  2026: "#1ED760",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function SeasonalOverlay() {
  const rawData = habits.seasonal_overlay;

  // Get all unique years, sorted
  const years = [...new Set(rawData.map((d) => d.year))].sort();
  const latestYear = Math.max(...years);

  // Build per-month dataset
  const monthData = Array.from({ length: 12 }, (_, i) => {
    const entry: Record<string, number | string> = { month: MONTH_NAMES[i] };
    for (const year of years) {
      const found = rawData.find((d) => d.month_of_year === i + 1 && d.year === year);
      if (found) entry[String(year)] = found.hours;
    }
    return entry;
  });

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Seasonal Listening by Year
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={monthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#8B8BA3", fontSize: 11, fontFamily: "Outfit" }}>{value}</span>
            )}
          />
          {years.map((year) => (
            <Line
              key={year}
              type="monotone"
              dataKey={String(year)}
              stroke={YEAR_COLORS[year] ?? "#1ED760"}
              strokeWidth={year === latestYear ? 2 : 1}
              opacity={year === latestYear ? 1 : 0.4}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
