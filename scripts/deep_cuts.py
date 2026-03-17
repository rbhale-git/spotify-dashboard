import pandas as pd
import numpy as np
import math


def compute_deep_cuts(df: pd.DataFrame) -> dict:
    """Compute deep cuts: loyalty, one-hit wonders, most replayed, hidden gems, diversity."""
    df = df.copy()

    df["year"] = df["ts"].dt.year
    total_years = df["year"].max() - df["year"].min() + 1

    artist_stats = df.groupby("master_metadata_album_artist_name").agg(
        total_plays=("ts", "count"),
        years_active=("year", "nunique"),
    ).reset_index()

    artist_stats["score"] = artist_stats.apply(
        lambda r: round((r["years_active"] / total_years) * math.log2(r["total_plays"] + 1), 2),
        axis=1,
    )
    loyalty_scores = (
        artist_stats.sort_values("score", ascending=False)
        .head(20)
        .rename(columns={"master_metadata_album_artist_name": "artist"})
        [["artist", "score", "years_active", "total_plays"]]
        .to_dict("records")
    )

    track_plays = df.groupby(["spotify_track_uri", "master_metadata_track_name", "master_metadata_album_artist_name"]).agg(
        play_count=("ts", "count"),
        last_reason_end=("reason_end", "last"),
        date=("ts", "max"),
    ).reset_index()

    one_hits = track_plays[
        (track_plays["play_count"] == 1) & (track_plays["last_reason_end"] == "trackdone")
    ].sort_values("date", ascending=False).head(100)

    one_hit_wonders = [
        {"track": r["master_metadata_track_name"], "artist": r["master_metadata_album_artist_name"],
         "date": r["date"].strftime("%Y-%m-%d")}
        for _, r in one_hits.iterrows()
    ]

    most_replayed_df = track_plays.sort_values("play_count", ascending=False).head(20)
    most_replayed = [
        {"track": r["master_metadata_track_name"], "artist": r["master_metadata_album_artist_name"],
         "plays": int(r["play_count"])}
        for _, r in most_replayed_df.iterrows()
    ]

    track_detail = df.groupby(["spotify_track_uri", "master_metadata_track_name", "master_metadata_album_artist_name"]).agg(
        play_count=("ts", "count"),
        avg_ms=("ms_played", "mean"),
        completion_rate=("reason_end", lambda x: round((x == "trackdone").mean(), 2)),
    ).reset_index()

    gems = track_detail[
        (track_detail["play_count"] < 5)
        & (track_detail["completion_rate"] >= 0.8)
        & (track_detail["avg_ms"] > 60000)
    ].sort_values("completion_rate", ascending=False).head(50)

    hidden_gems = [
        {"track": r["master_metadata_track_name"], "artist": r["master_metadata_album_artist_name"],
         "plays": int(r["play_count"]), "completion_rate": float(r["completion_rate"])}
        for _, r in gems.iterrows()
    ]

    df["month"] = df["ts"].dt.to_period("M").astype(str)
    monthly_groups = df.groupby("month")

    diversity_index = []
    for month, group in monthly_groups:
        if len(group) < 20:
            continue
        artist_counts = group["master_metadata_album_artist_name"].value_counts()
        probs = artist_counts / artist_counts.sum()
        entropy = -float((probs * np.log2(probs)).sum())
        diversity_index.append({"month": str(month), "index": round(entropy, 2)})

    return {
        "loyalty_scores": loyalty_scores,
        "one_hit_wonders": one_hit_wonders,
        "most_replayed": most_replayed,
        "hidden_gems": hidden_gems,
        "diversity_index": diversity_index,
    }
