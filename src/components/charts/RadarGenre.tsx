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

export default function RadarGenre() {
  const data = recommendations.radar_data.map((d) => ({
    // Shorten to first artist name
    genre: d.genre.split(",")[0].trim(),
    value: Math.round(d.value * 100),
  }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Genre Cluster Affinities</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis
            dataKey="genre"
            tick={{ fill: "#b3b3b3", fontSize: 10 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 50]}
            tick={{ fill: "#6a6a6a", fontSize: 9 }}
          />
          <Radar
            name="Affinity %"
            dataKey="value"
            stroke="#1DB954"
            fill="#1DB954"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [`${value}%`, "Affinity"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
