import SectionHeader from "@/components/ui/SectionHeader";
import RadarGenre from "@/components/charts/RadarGenre";
import GenreTimeline from "@/components/charts/GenreTimeline";
import ArtistCard from "@/components/charts/ArtistCard";
import { recommendations } from "@/lib/data";

export default function RecommendationsSection() {
  const artists = recommendations.suggested_artists;

  return (
    <section className="mb-12">
      <SectionHeader
        id="recommendations"
        title="Recommendations"
        subtitle="Genre clusters, taste profile radar, and suggested artists based on listening patterns"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <RadarGenre />
        <div>
          <div className="glass-card p-4 mb-0">
            <h3
              className="text-xs uppercase tracking-wider font-semibold mb-3"
              style={{ color: "#4A4A62" }}
            >
              Suggested Artists
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {artists.map((a, i) => (
                <ArtistCard
                  key={i}
                  artist={a.artist}
                  cluster={a.cluster}
                  match_pct={a.match_pct}
                  current_plays={a.current_plays}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <GenreTimeline />
    </section>
  );
}
