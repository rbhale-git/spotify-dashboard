"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

export default function BingeScoreSection() {
  const { binges } = insights;
  const { top_binges, total_binge_sessions, top_binge_artists } = binges;

  const longestBinge = top_binges.length > 0
    ? Math.max(...top_binges.map((b) => b.track_count))
    : 0;

  const bingeArtistData = top_binge_artists.slice(0, 12).map((a) => ({
    artist:
      a.artist.length > 16 ? a.artist.slice(0, 14) + "…" : a.artist,
    binge_count: a.binge_count,
  }));

  return (
    <section className="mb-12">
      <SectionHeader
        id="binge-score"
        title="Binge Score"
        subtitle="Your most intense listening sessions — when you couldn&apos;t stop replaying an artist"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          value={total_binge_sessions.toLocaleString()}
          label="Total Binge Sessions"
          color="text-sp-green"
          delay={0}
        />
        <StatCard
          value={longestBinge}
          label="Longest Binge (tracks)"
          color="text-sp-amber"
          delay={1}
        />
      </div>

      {/* Top binges scrollable table */}
      <div className="glass-card p-6 mb-4">
        <h3
          className="text-xs uppercase tracking-wider font-semibold mb-4"
          style={{ color: "#8B8BA3" }}
        >
          Top Binge Sessions
        </h3>
        <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
          {/* Header */}
          <div
            className="grid gap-3 px-3 py-2 text-[10px] uppercase tracking-wider font-semibold mb-1"
            style={{
              color: "#4A4A62",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            }}
          >
            <span>Artist</span>
            <span className="text-right">Tracks</span>
            <span className="text-right">Unique</span>
            <span className="text-right">Hours</span>
            <span className="text-right">Date</span>
          </div>
          <div className="space-y-1">
            {top_binges.slice(0, 20).map((binge, i) => (
              <div
                key={i}
                className="grid gap-3 px-3 py-2.5 rounded-lg items-center"
                style={{
                  backgroundColor: "rgba(5, 5, 8, 0.5)",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-[10px] font-mono shrink-0"
                    style={{ color: "#4A4A62" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-sm truncate"
                    style={{ color: "#EAEAEA" }}
                  >
                    {binge.artist}
                  </span>
                </div>
                <span
                  className="text-sm text-right font-mono"
                  style={{ color: "#1ED760" }}
                >
                  {binge.track_count}
                </span>
                <span
                  className="text-sm text-right font-mono"
                  style={{ color: "#8B8BA3" }}
                >
                  {binge.unique_tracks}
                </span>
                <span
                  className="text-sm text-right font-mono"
                  style={{ color: "#8B8BA3" }}
                >
                  {binge.hours.toFixed(1)}h
                </span>
                <span
                  className="text-[11px] text-right"
                  style={{ color: "#4A4A62" }}
                >
                  {binge.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top binge artists horizontal bar chart */}
      <div className="glass-card p-6">
        <h3
          className="text-xs uppercase tracking-wider font-semibold mb-5"
          style={{ color: "#8B8BA3" }}
        >
          Top Binge Artists
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={bingeArtistData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#1a1a2e"
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="artist"
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "#8B8BA3", marginBottom: 4 }}
              formatter={(v) => [v, "Binge Sessions"]}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="binge_count"
              radius={[0, 4, 4, 0]}
              maxBarSize={16}
            >
              {bingeArtistData.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === 0
                      ? "#1ED760"
                      : `rgba(30, 215, 96, ${Math.max(0.25, 1 - i * 0.065)})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
