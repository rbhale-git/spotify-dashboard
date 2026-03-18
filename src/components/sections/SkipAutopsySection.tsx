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
import ScrollableList from "@/components/ui/ScrollableList";
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

export default function SkipAutopsySection() {
  const { skip_autopsy } = insights;

  const skippedArtistData = skip_autopsy.most_skipped_artists
    .slice(0, 10)
    .map((a) => ({
      artist: a.artist.length > 16 ? a.artist.slice(0, 14) + "…" : a.artist,
      skip_pct: Math.round(a.skip_rate * 100),
    }));

  const neverSkippedArtistItems = skip_autopsy.never_skipped_artists
    .slice(0, 20)
    .map((a) => ({
      primary: a.artist,
      secondary: "",
      detail: `${a.total_plays} plays`,
    }));

  const skippedTrackItems = skip_autopsy.most_skipped_tracks
    .slice(0, 20)
    .map((t) => ({
      primary: t.track,
      secondary: t.artist,
      detail: `${Math.round(t.skip_rate * 100)}% skipped`,
    }));

  const neverSkippedTrackItems = skip_autopsy.never_skipped_tracks
    .slice(0, 20)
    .map((t) => ({
      primary: t.track,
      secondary: t.artist,
      detail: `${t.total_plays} plays`,
    }));

  return (
    <section className="mb-12">
      <SectionHeader
        id="skip-autopsy"
        title="Skip Autopsy"
        subtitle="What you skip, what you never skip — patterns in your listening commitment"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Most Skipped Artists bar chart */}
        <div className="glass-card p-6">
          <h3
            className="text-xs uppercase tracking-wider font-semibold mb-5"
            style={{ color: "#8B8BA3" }}
          >
            Most Skipped Artists
          </h3>
          {skippedArtistData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={skippedArtistData}
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
                  domain={[0, 100]}
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="artist"
                  tick={AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: "#8B8BA3", marginBottom: 4 }}
                  formatter={(v) => [`${v}%`, "Skip Rate"]}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="skip_pct" radius={[0, 4, 4, 0]} maxBarSize={14}>
                  {skippedArtistData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? "#ff6b6b" : `rgba(255, 107, 107, ${1 - i * 0.07})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm" style={{ color: "#8B8BA3" }}>
              No skip data available.
            </p>
          )}
        </div>

        {/* Never Skipped Artists */}
        {neverSkippedArtistItems.length > 0 ? (
          <ScrollableList
            title="Never Skipped Artists"
            items={neverSkippedArtistItems}
            maxHeight="300px"
          />
        ) : (
          <div className="glass-card p-6 flex items-center justify-center">
            <p className="text-sm" style={{ color: "#8B8BA3" }}>
              No never-skipped artists data available.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollableList
          title="Most Skipped Tracks"
          items={skippedTrackItems}
          maxHeight="300px"
        />
        <ScrollableList
          title="Never Skipped Tracks"
          items={neverSkippedTrackItems}
          maxHeight="300px"
        />
      </div>
    </section>
  );
}
