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
import { habits } from "@/lib/data";

export default function HourlyBar() {
  const data = habits.hourly_distribution.map((d) => ({
    hour: `${d.hour}:00`,
    streams: d.streams,
  }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">Streams by Hour of Day</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#6a6a6a", fontSize: 9 }}
            tickLine={false}
            interval={3}
          />
          <YAxis tick={{ fill: "#6a6a6a", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Bar dataKey="streams" fill="#1DB954" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
