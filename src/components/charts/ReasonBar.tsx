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

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #1e1e2e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 12,
};

export default function ReasonBar({ type }: ReasonBarProps) {
  const rawData = type === "start" ? sessions.reason_start : sessions.reason_end;
  const data = rawData
    .slice(0, 8)
    .map((d) => ({ reason: REASON_LABELS[d.reason] ?? d.reason, count: d.count }));

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        {type === "start" ? "Why Tracks Start" : "Why Tracks End"}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 90, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#4A4A62", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            axisLine={{ stroke: "#1e1e2e" }}
          />
          <YAxis
            dataKey="reason"
            type="category"
            tick={{ fill: "#8B8BA3", fontSize: 10, fontFamily: "Outfit" }}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [value, "Count"]}
          />
          <Bar
            dataKey="count"
            fill={type === "start" ? "#4ECDC4" : "#8b5cf6"}
            radius={[0, 2, 2, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
