import StatCard from "@/components/ui/StatCard";
import SectionHeader from "@/components/ui/SectionHeader";
import AreaTimeline from "@/components/charts/AreaTimeline";
import DonutChart from "@/components/charts/DonutChart";
import { overview } from "@/lib/data";

export default function OverviewSection() {
  const { hero_stats } = overview;

  return (
    <section className="mb-12">
      <SectionHeader
        id="overview"
        title="Listening Overview"
        subtitle="8 years of Spotify listening history at a glance"
      />

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
