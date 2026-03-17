"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RadarGenreProps {
  data: { genre: string; value: number }[];
}

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function RadarGenre({ data }: RadarGenreProps) {
  const formatted = data.map((d) => ({
    genre: d.genre.split(",")[0].trim(),
    value: Math.round(d.value * 100),
  }));

  const maxValue = Math.max(...formatted.map((d) => d.value), 10);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Genre Cluster Affinities
      </h3>
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={formatted} margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
          <PolarGrid stroke="#2a2a3e" />
          <PolarAngleAxis
            dataKey="genre"
            tick={{ fill: "#BBBBD0", fontSize: 12, fontFamily: "Outfit", fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, Math.ceil(maxValue / 10) * 10]}
            tick={{ fill: "#9999B0", fontSize: 10, fontFamily: "Outfit" }}
          />
          <Radar
            name="Affinity %"
            dataKey="value"
            stroke="#1ED760"
            fill="#1ED760"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [`${value}%`, "Affinity"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
