import SectionHeader from "@/components/ui/SectionHeader";
import ScrollableList from "@/components/ui/ScrollableList";
import TopArtistsYear from "@/components/charts/TopArtistsYear";
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
    <section className="mb-12">
      <SectionHeader
        id="deep-cuts"
        title="Deep Cuts"
        subtitle="Artist loyalty, one-hit wonders, most replayed tracks, and hidden gems"
      />

      {/* Top Artists with year picker + Loyalty scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TopArtistsYear />
        <LoyaltyBar />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ScrollableList
          title="Most Replayed Tracks"
          items={mostReplayedItems}
          maxHeight="260px"
        />
        <ScrollableList
          title="One-Hit Wonders"
          items={oneHitItems}
          maxHeight="260px"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollableList
          title="Hidden Gems"
          items={hiddenGemsItems}
          maxHeight="260px"
        />
        <DiversityLine />
      </div>
    </section>
  );
}
