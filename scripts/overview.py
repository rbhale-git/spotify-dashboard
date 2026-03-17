import pandas as pd


def compute_overview(df: pd.DataFrame) -> dict:
    """Compute overview stats: hero stats, monthly volume, platform breakdown."""
    total_streams = len(df)  # Uses cleaned record count (post-filtering)
    total_hours = round(df["ms_played"].sum() / 3600000, 1)
    unique_tracks = df["spotify_track_uri"].nunique()
    unique_artists = df["master_metadata_album_artist_name"].nunique()

    hero_stats = {
        "total_streams": int(total_streams),
        "total_hours": float(total_hours),
        "unique_tracks": int(unique_tracks),
        "unique_artists": int(unique_artists),
    }

    # Monthly volume
    df = df.copy()
    df["month"] = df["ts"].dt.to_period("M").astype(str)
    monthly = df.groupby("month").agg(
        hours=("ms_played", lambda x: round(x.sum() / 3600000, 1)),
        streams=("ms_played", "count"),
    ).reset_index()
    monthly_volume = monthly.to_dict("records")

    # Platform breakdown
    platform_counts = df["platform"].value_counts()
    total = platform_counts.sum()
    platform_breakdown = [
        {
            "platform": platform,
            "streams": int(count),
            "percentage": round(count / total * 100, 1),
        }
        for platform, count in platform_counts.items()
    ]

    return {
        "hero_stats": hero_stats,
        "monthly_volume": monthly_volume,
        "platform_breakdown": platform_breakdown,
    }
