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
  2018: "#1DB954",
  2019: "#17923f",
  2020: "#52b788",
  2021: "#74c69d",
  2022: "#95d5b2",
  2023: "#b7e4c7",
  2024: "#1ed760",
  2025: "#1aa34a",
  2026: "#1DB954",
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
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Seasonal Listening by Year</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={monthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" tick={{ fill: "#6a6a6a", fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fill: "#6a6a6a", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#b3b3b3", fontSize: 11 }}>{value}</span>
            )}
          />
          {years.map((year) => (
            <Line
              key={year}
              type="monotone"
              dataKey={String(year)}
              stroke={YEAR_COLORS[year] ?? "#1DB954"}
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
