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
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function LoyaltyBar() {
  const data = deepCuts.loyalty_scores.slice(0, 15).map((d) => ({
    artist: d.artist.length > 22 ? d.artist.slice(0, 20) + "..." : d.artist,
    fullName: d.artist,
    score: d.score,
    plays: d.total_plays,
    years: d.years_active,
  }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Artist Loyalty Scores (Top 15)
      </h3>
      <ResponsiveContainer width="100%" height={480}>
        <BarChart
          data={data}
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
              const p = props.payload;
              return [`Score: ${value} | ${p.years} yrs | ${p.plays} plays`, p.fullName];
            }}
          />
          <Bar dataKey="score" fill="#1ED760" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
