interface ArtistCardProps {
  artist: string;
  cluster: string;
  match_pct: number;
  current_plays: number;
}

export default function ArtistCard({ artist, cluster, match_pct, current_plays }: ArtistCardProps) {
  const clusterLabel = cluster.split(",")[0].trim();

  return (
    <div className="bg-spotify-dark-elevated rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-spotify-text-primary">{artist}</div>
        <div className="text-xs text-spotify-text-muted mt-0.5">{clusterLabel} cluster</div>
        {current_plays > 1 && (
          <div className="text-xs text-spotify-text-muted">{current_plays} plays already</div>
        )}
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-spotify-green">{match_pct}%</div>
        <div className="text-[10px] text-spotify-text-muted">match</div>
      </div>
    </div>
  );
}
