"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { overview } from "@/lib/data";

export default function AreaTimeline() {
  const data = overview.monthly_volume.map((d) => ({
    ...d,
    label: d.month.slice(0, 7),
  }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Monthly Listening Volume</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1DB954" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#1DB954" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6a6a6a", fontSize: 10 }}
            tickLine={false}
            interval={11}
          />
          <YAxis
            tick={{ fill: "#6a6a6a", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [`${value} hrs`, "Hours"]}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#1DB954"
            strokeWidth={2}
            fill="url(#greenGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
