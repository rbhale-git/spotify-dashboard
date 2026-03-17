"use client";

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

export default function LoyaltyBar() {
  const data = deepCuts.loyalty_scores.slice(0, 20).map((d) => ({
    artist: d.artist,
    score: d.score,
    plays: d.total_plays,
    years: d.years_active,
  }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Artist Loyalty Scores (Top 20)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#6a6a6a", fontSize: 10 }}
            tickLine={false}
            domain={[0, 12]}
          />
          <YAxis
            dataKey="artist"
            type="category"
            tick={{ fill: "#b3b3b3", fontSize: 10 }}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value, name) => [value, name === "score" ? "Loyalty Score" : name]}
          />
          <Bar dataKey="score" fill="#1DB954" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
