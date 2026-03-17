interface ArtistCardProps {
  artist: string;
  cluster: string;
  match_pct: number;
  current_plays: number;
}

export default function ArtistCard({ artist, cluster, match_pct, current_plays }: ArtistCardProps) {
  const clusterLabel = cluster.split(",")[0].trim();

  return (
    <div
      className="artist-card rounded-xl p-4 flex items-center justify-between border transition-all duration-200"
      style={{
        backgroundColor: "#161622",
        borderColor: "#1e1e2e",
      }}
    >
      <div>
        <div className="text-sm font-semibold" style={{ color: "#EAEAEA" }}>{artist}</div>
        <div className="text-xs mt-0.5" style={{ color: "#4A4A62" }}>{clusterLabel} cluster</div>
        {current_plays > 1 && (
          <div className="text-xs" style={{ color: "#4A4A62" }}>{current_plays} plays already</div>
        )}
      </div>
      <div className="text-right">
        <div
          className="text-lg font-bold"
          style={{ color: "#1ED760", fontFamily: "var(--font-display)" }}
        >
          {match_pct}%
        </div>
        <div className="text-[10px]" style={{ color: "#4A4A62" }}>match</div>
      </div>
    </div>
  );
}
