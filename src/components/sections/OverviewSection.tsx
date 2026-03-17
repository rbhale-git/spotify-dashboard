import StatCard from "@/components/ui/StatCard";
import AreaTimeline from "@/components/charts/AreaTimeline";
import DonutChart from "@/components/charts/DonutChart";
import { overview, metadata } from "@/lib/data";

export default function OverviewSection() {
  const { hero_stats } = overview;
  const start = new Date(metadata.date_range.start).getFullYear();
  const end = new Date(metadata.date_range.end).getFullYear();

  return (
    <section className="mb-12">
      {/* Hero banner */}
      <div id="overview" className="scroll-mt-20 mb-10">
        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          {/* Subtle glow accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-30%",
              right: "-10%",
              width: "50%",
              height: "160%",
              background: "radial-gradient(ellipse at center, rgba(30, 215, 96, 0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#1ED760", fontFamily: "Outfit" }}>
              {start} — {end}
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-display)", color: "#EAEAEA" }}
            >
              Your Listening Story
            </h1>
            <p className="text-base md:text-lg" style={{ color: "#8B8BA3", maxWidth: 520 }}>
              {hero_stats.total_streams.toLocaleString()} streams across {Math.round(hero_stats.total_hours).toLocaleString()} hours — {hero_stats.unique_artists.toLocaleString()} artists and {hero_stats.unique_tracks.toLocaleString()} unique tracks.
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          value={hero_stats.total_streams.toLocaleString()}
          label="Total Streams"
          color="text-sp-green"
          delay={0}
        />
        <StatCard
          value={`${Math.round(hero_stats.total_hours).toLocaleString()}h`}
          label="Total Hours"
          color="text-sp-green"
          delay={1}
        />
        <StatCard
          value={hero_stats.unique_tracks.toLocaleString()}
          label="Unique Tracks"
          color="text-sp-teal"
          delay={2}
        />
        <StatCard
          value={hero_stats.unique_artists.toLocaleString()}
          label="Unique Artists"
          color="text-sp-amber"
          delay={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AreaTimeline />
        </div>
        <div className="lg:col-span-1">
          <DonutChart />
        </div>
      </div>
    </section>
  );
}
