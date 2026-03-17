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

interface ReasonBarProps {
  type: "start" | "end";
}

const REASON_LABELS: Record<string, string> = {
  clickrow: "Click Row",
  trackdone: "Track Done",
  fwdbtn: "Forward Btn",
  playbtn: "Play Btn",
  appload: "App Load",
  remote: "Remote",
  backbtn: "Back Btn",
  trackerror: "Track Error",
  unknown: "Unknown",
  "switched-to-audio": "Switch Audio",
  endplay: "End Play",
  "unexpected-exit-while-paused": "Exit Paused",
  logout: "Logout",
  "unexpected-exit": "Unexpected Exit",
};

export default function ReasonBar({ type }: ReasonBarProps) {
  const rawData = type === "start" ? sessions.reason_start : sessions.reason_end;
  const data = rawData
    .slice(0, 8)
    .map((d) => ({ reason: REASON_LABELS[d.reason] ?? d.reason, count: d.count }));

  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">
        {type === "start" ? "Why Tracks Start" : "Why Tracks End"}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 90, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#6a6a6a", fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            dataKey="reason"
            type="category"
            tick={{ fill: "#b3b3b3", fontSize: 10 }}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(value) => [value, "Count"]}
          />
          <Bar
            dataKey="count"
            fill={type === "start" ? "#3b82f6" : "#8b5cf6"}
            radius={[0, 2, 2, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
