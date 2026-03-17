import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import SkipTrend from "@/components/charts/SkipTrend";
import SessionHistogram from "@/components/charts/SessionHistogram";
import ReasonBar from "@/components/charts/ReasonBar";
import { sessions } from "@/lib/data";

export default function SessionsSection() {
  const { overall } = sessions;

  return (
    <section className="mb-12">
      <SectionHeader
        id="sessions"
        title="Sessions"
        subtitle="Skip behavior, session lengths, and how you navigate your music"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          value={`${Math.round(overall.skip_rate * 100)}%`}
          label="Skip Rate"
          color="text-sp-coral"
          delay={0}
        />
        <StatCard
          value={`${overall.avg_session_minutes}m`}
          label="Avg Session Length"
          color="text-sp-teal"
          delay={1}
        />
        <StatCard
          value={`${Math.round(overall.shuffle_rate * 100)}%`}
          label="Shuffle Rate"
          color="text-sp-amber"
          delay={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SkipTrend />
        <SessionHistogram />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReasonBar type="start" />
        <ReasonBar type="end" />
      </div>
    </section>
  );
}
