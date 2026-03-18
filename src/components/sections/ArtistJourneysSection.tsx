"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SectionHeader from "@/components/ui/SectionHeader";
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

export default function ArtistJourneysSection() {
  const { artists, data } = insights.artist_journeys;
  const [selected, setSelected] = useState(artists[0]);

  const artistData = data[selected];

  const recentPlays = artistData?.recent_plays ?? 0;

  return (
    <section className="mb-12">
      <SectionHeader
        id="artist-journeys"
        title="Artist Journeys"
        subtitle="Track how your relationship with each artist has evolved over time"
      />

      {/* Artist selector */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: "#8B8BA3" }}
          >
            Select Artist
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {artists.map((artist) => (
            <button
              key={artist}
              onClick={() => setSelected(artist)}
              className="transition-all duration-200 font-medium"
              style={{
                padding: "6px 14px",
                borderRadius: 10,
                fontSize: 12,
                fontFamily: "Outfit",
                border:
                  selected === artist
                    ? "1px solid rgba(30, 215, 96, 0.5)"
                    : "1px solid rgba(30, 30, 46, 0.6)",
                backgroundColor:
                  selected === artist
                    ? "rgba(30, 215, 96, 0.12)"
                    : "rgba(13, 13, 20, 0.6)",
                color: selected === artist ? "#1ED760" : "#8B8BA3",
                cursor: "pointer",
              }}
            >
              {artist}
            </button>
          ))}
        </div>
      </div>

      {artistData && (
        <>
          {/* Area chart */}
          <div className="glass-card p-6 mb-4">
            <h3
              className="text-xs uppercase tracking-wider font-semibold mb-5"
              style={{ color: "#8B8BA3" }}
            >
              Monthly Plays — {selected}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={artistData.timeline}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="journeyGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1ED760" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1ED760" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1a1a2e" strokeDasharray="3 3" vertical={false} />
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
                  cursor={{ stroke: "#2a2a3e" }}
                />
                <Area
                  type="monotone"
                  dataKey="plays"
                  stroke="#1ED760"
                  strokeWidth={2}
                  fill="url(#journeyGreen)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#1ED760" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "#1ED760" }}
              >
                {artistData.discovery}
              </div>
              <div
                className="text-[11px] uppercase tracking-wider font-medium"
                style={{ color: "#4A4A62" }}
              >
                Discovery Date
              </div>
            </div>
            <div className="glass-card p-5 text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "#1ED760" }}
              >
                {artistData.peak_month}
              </div>
              <div
                className="text-[11px] uppercase tracking-wider font-medium"
                style={{ color: "#4A4A62" }}
              >
                Peak Month ({artistData.peak_plays} plays)
              </div>
            </div>
            <div className="glass-card p-5 text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "#8B8BA3" }}
              >
                {recentPlays.toLocaleString()}
              </div>
              <div
                className="text-[11px] uppercase tracking-wider font-medium"
                style={{ color: "#4A4A62" }}
              >
                Recent Plays (last 3 mo)
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
