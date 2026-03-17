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

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function LoyaltyBar() {
  const data = deepCuts.loyalty_scores.slice(0, 20).map((d) => ({
    artist: d.artist,
    score: d.score,
    plays: d.total_plays,
    years: d.years_active,
  }));

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Artist Loyalty Scores (Top 20)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={{ stroke: "#1e1e2e" }}
            domain={[0, 12]}
          />
          <YAxis
            dataKey="artist"
            type="category"
            tick={{ fill: "#8B8BA3", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [value, name === "score" ? "Loyalty Score" : name]}
          />
          <Bar dataKey="score" fill="#1ED760" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
