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
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function ReasonBar({ type }: ReasonBarProps) {
  const rawData = type === "start" ? sessions.reason_start : sessions.reason_end;
  const data = rawData
    .slice(0, 8)
    .map((d) => ({ reason: REASON_LABELS[d.reason] ?? d.reason, count: d.count }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        {type === "start" ? "Why Tracks Start" : "Why Tracks End"}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
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
            dataKey="reason"
            type="category"
            tick={{ fill: "#BBBBD0", fontSize: 12, fontFamily: "Outfit" }}
            tickLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [typeof value === "number" ? value.toLocaleString() : value, "Count"]}
          />
          <Bar
            dataKey="count"
            fill={type === "start" ? "#4ECDC4" : "#8b5cf6"}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
