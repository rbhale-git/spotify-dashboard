"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { insights } from "@/lib/data";

const AXIS_STYLE = { fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" };
const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d14",
  border: "1px solid #2a2a3e",
  borderRadius: 12,
  color: "#EAEAEA",
  fontFamily: "Outfit",
  fontSize: 13,
  padding: "10px 14px",
};

export default function RepeatExploreSection() {
  const { repeat_explore } = insights;
  const { monthly, total_unique_tracks } = repeat_explore;

  const avgNewPct =
    monthly.length > 0
      ? Math.round(
          monthly.reduce((sum, m) => sum + m.new_pct, 0) / monthly.length
        )
      : 0;

  return (
    <section className="mb-12">
      <SectionHeader
        id="repeat-explore"
        title="Repeat vs Explore"
        subtitle="How much you revisit old favourites vs discover new music each month"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          value={total_unique_tracks.toLocaleString()}
          label="Total Unique Tracks"
          color="text-sp-green"
          delay={0}
        />
        <StatCard
          value={`${avgNewPct}%`}
          label="Avg. Exploration Rate"
          color="text-sp-teal"
          delay={1}
        />
      </div>

      {/* Stacked area chart */}
      <div className="glass-card p-6 mb-4">
        <h3
          className="text-xs uppercase tracking-wider font-semibold mb-5"
          style={{ color: "#8B8BA3" }}
        >
          Repeat vs New — Monthly Share
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={monthly}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="repeatGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1ED760" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1ED760" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="newTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1DB8C9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1DB8C9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#1a1a2e"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "#8B8BA3", marginBottom: 4 }}
              formatter={(v, name) => [
                typeof v === "number" ? `${v.toFixed(1)}%` : v,
                name === "repeat_pct" ? "Repeat" : "New",
              ]}
              cursor={{ stroke: "#2a2a3e" }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "Outfit", fontSize: 12, color: "#8B8BA3" }}
              formatter={(value) => (value === "repeat_pct" ? "Repeat" : "Explore")}
            />
            <Area
              type="monotone"
              dataKey="repeat_pct"
              stackId="1"
              stroke="#1ED760"
              strokeWidth={2}
              fill="url(#repeatGreen)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="new_pct"
              stackId="2"
              stroke="#1DB8C9"
              strokeWidth={2}
              fill="url(#newTeal)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* New tracks discovered bar chart */}
      <div className="glass-card p-6">
        <h3
          className="text-xs uppercase tracking-wider font-semibold mb-5"
          style={{ color: "#8B8BA3" }}
        >
          New Tracks Discovered Per Month
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={monthly}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#1a1a2e"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "#8B8BA3", marginBottom: 4 }}
              formatter={(v) => [typeof v === "number" ? v.toLocaleString() : v, "New Tracks"]}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="new_tracks_discovered"
              fill="#1DB8C9"
              radius={[3, 3, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
