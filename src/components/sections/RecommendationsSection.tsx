"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import RadarGenre from "@/components/charts/RadarGenre";
import GenreTimeline from "@/components/charts/GenreTimeline";
import ArtistCard from "@/components/charts/ArtistCard";
import { recommendations } from "@/lib/data";

export default function RecommendationsSection() {
  const periods = recommendations.periods;
  // Default to most recent period (last in list, excluding "All Time")
  const mostRecent = periods[periods.length - 1] ?? "All Time";
  const [selectedPeriod, setSelectedPeriod] = useState(mostRecent);

  const currentData = recommendations.data[selectedPeriod];
  const hasData = currentData && currentData.genre_clusters.length > 0;

  return (
    <section className="mb-12">
      <SectionHeader
        id="recommendations"
        title="Recommendations"
        subtitle="Genre clusters, taste profile, and suggested artists based on listening patterns"
      />

      {/* Period selector */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#8B8BA3" }}>
            Time Period
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className="transition-all duration-200 font-medium"
              style={{
                padding: "6px 14px",
                borderRadius: 10,
                fontSize: 12,
                fontFamily: "Outfit",
                border: selectedPeriod === period
                  ? "1px solid rgba(30, 215, 96, 0.5)"
                  : "1px solid rgba(30, 30, 46, 0.6)",
                backgroundColor: selectedPeriod === period
                  ? "rgba(30, 215, 96, 0.12)"
                  : "rgba(13, 13, 20, 0.6)",
                color: selectedPeriod === period ? "#1ED760" : "#8B8BA3",
                cursor: "pointer",
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <RadarGenre data={currentData.radar_data} />
            <div className="glass-card p-6">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: "#8B8BA3" }}>
                Suggested Artists
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                {currentData.suggested_artists.length > 0 ? (
                  currentData.suggested_artists.map((a, i) => (
                    <ArtistCard
                      key={`${selectedPeriod}-${i}`}
                      artist={a.artist}
                      cluster={a.cluster}
                      match_pct={a.match_pct}
                      current_plays={a.current_plays}
                    />
                  ))
                ) : (
                  <p className="text-sm col-span-2" style={{ color: "#8B8BA3" }}>
                    No new artist suggestions for this period.
                  </p>
                )}
              </div>
            </div>
          </div>

          <GenreTimeline data={currentData.genre_timeline} />
        </>
      ) : (
        <div className="glass-card p-10 text-center">
          <p className="text-sm" style={{ color: "#8B8BA3" }}>
            Not enough listening data in this period for meaningful recommendations.
          </p>
        </div>
      )}
    </section>
  );
}
