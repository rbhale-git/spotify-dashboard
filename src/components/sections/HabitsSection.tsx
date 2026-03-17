import SectionHeader from "@/components/ui/SectionHeader";
import Heatmap from "@/components/charts/Heatmap";
import SeasonalOverlay from "@/components/charts/SeasonalOverlay";
import HourlyBar from "@/components/charts/HourlyBar";

export default function HabitsSection() {
  return (
    <section className="mb-16">
      <SectionHeader
        id="habits"
        title="Listening Habits"
        subtitle="When and how you listen — heatmaps, seasonal patterns, and time-of-day trends"
      />

      <div className="mb-4">
        <Heatmap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SeasonalOverlay />
        <HourlyBar />
      </div>
    </section>
  );
}
