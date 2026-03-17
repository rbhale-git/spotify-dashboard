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
import { sessions } from "@/lib/data";

export default function SessionHistogram() {
  const data = sessions.length_distribution;

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Session Length Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="bucket" tick={{ fill: "#6a6a6a", fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: "#6a6a6a", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [value, "Sessions"]}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
