"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { deepCuts } from "@/lib/data";

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function TopArtistsYear() {
  const { years, data } = deepCuts.top_artists_by_year;
  const mostRecent = years[years.length - 1] ?? "All Time";
  const [selectedYear, setSelectedYear] = useState(mostRecent);

  const currentData = (data[selectedYear] ?? []).slice(0, 15).map((d) => ({
    artist: d.artist.length > 22 ? d.artist.slice(0, 20) + "..." : d.artist,
    fullName: d.artist,
    plays: d.total_plays,
    hours: d.total_hours,
  }));

  return (
    <div className="glass-card p-6">
      <h3
        className="text-xs uppercase tracking-wider font-semibold mb-4"
        style={{ color: "#8B8BA3" }}
      >
        Favorite Artists
      </h3>

      {/* Year selector */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className="transition-all duration-200 font-medium"
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "Outfit",
              border:
                selectedYear === year
                  ? "1px solid rgba(30, 215, 96, 0.5)"
                  : "1px solid rgba(30, 30, 46, 0.6)",
              backgroundColor:
                selectedYear === year
                  ? "rgba(30, 215, 96, 0.12)"
                  : "rgba(13, 13, 20, 0.6)",
              color: selectedYear === year ? "#1ED760" : "#8B8BA3",
              cursor: "pointer",
            }}
          >
            {year}
          </button>
        ))}
      </div>

      {currentData.length > 0 ? (
        <ResponsiveContainer width="100%" height={480}>
          <BarChart
            data={currentData}
            layout="vertical"
            margin={{ top: 5, right: 24, left: 8, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" }}
              tickLine={false}
              axisLine={{ stroke: "#1a1a2e" }}
            />
            <YAxis
              dataKey="artist"
              type="category"
              tick={{ fill: "#BBBBD0", fontSize: 12, fontFamily: "Outfit" }}
              tickLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, _name, props) => {
                const p = props?.payload as { fullName?: string; plays?: number; hours?: number } | undefined;
                if (p) return [`${p.plays} plays | ${p.hours} hrs`, p.fullName];
                return [value, "Plays"];
              }}
            />
            <Bar dataKey="plays" fill="#1ED760" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-sm text-center py-10" style={{ color: "#8B8BA3" }}>
          No data for this year.
        </div>
      )}
    </div>
  );
}
