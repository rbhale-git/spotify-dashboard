import SectionHeader from "@/components/ui/SectionHeader";
import ScrollableList from "@/components/ui/ScrollableList";
import LoyaltyBar from "@/components/charts/LoyaltyBar";
import DiversityLine from "@/components/charts/DiversityLine";
import { deepCuts } from "@/lib/data";

export default function DeepCutsSection() {
  const oneHitItems = deepCuts.one_hit_wonders.slice(0, 50).map((item) => ({
    primary: item.track,
    secondary: item.artist,
    detail: item.date,
  }));

  const mostReplayedItems = deepCuts.most_replayed.map((item) => ({
    primary: item.track,
    secondary: item.artist,
    detail: `${item.plays} plays`,
  }));

  const hiddenGemsItems = deepCuts.hidden_gems.slice(0, 30).map((item) => ({
    primary: item.track,
    secondary: item.artist,
    detail: `${(item.completion_rate * 100).toFixed(0)}% complete`,
  }));

  return (
    <section className="mb-16">
      <SectionHeader
        id="deep-cuts"
        title="Deep Cuts"
        subtitle="Artist loyalty, one-hit wonders, most replayed tracks, and hidden gems"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LoyaltyBar />
        <div className="flex flex-col gap-4">
          <ScrollableList
            title="One-Hit Wonders (recently discovered artists)"
            items={oneHitItems}
            maxHeight="200px"
          />
          <ScrollableList
            title="Most Replayed Tracks"
            items={mostReplayedItems}
            maxHeight="200px"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollableList
          title="Hidden Gems (100% completion rate)"
          items={hiddenGemsItems}
          maxHeight="260px"
        />
        <DiversityLine />
      </div>
    </section>
  );
}
