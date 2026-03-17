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
import { recommendations } from "@/lib/data";

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function RadarGenre() {
  const data = recommendations.radar_data.map((d) => ({
    // Shorten to first artist name
    genre: d.genre.split(",")[0].trim(),
    value: Math.round(d.value * 100),
  }));

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Genre Cluster Affinities
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
          <PolarGrid stroke="#1e1e2e" />
          <PolarAngleAxis
            dataKey="genre"
            tick={{ fill: "#8B8BA3", fontSize: 10, fontFamily: "Outfit" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 50]}
            tick={{ fill: "#4A4A62", fontSize: 9, fontFamily: "Outfit" }}
          />
          <Radar
            name="Affinity %"
            dataKey="value"
            stroke="#1ED760"
            fill="#1ED760"
            fillOpacity={0.3}
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
