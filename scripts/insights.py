"""Additional insights: streaks, artist journeys, skip autopsy, repeat/explore, binge scores."""
import pandas as pd
import numpy as np


def compute_insights(df: pd.DataFrame) -> dict:
    """Compute all additional insight modules."""
    df = df.copy()

    streaks = compute_streaks(df)
    artist_journeys = compute_artist_journeys(df)
    skip_autopsy = compute_skip_autopsy(df)
    repeat_explore = compute_repeat_explore(df)
    binges = compute_binges(df)

    return {
        "streaks": streaks,
        "artist_journeys": artist_journeys,
        "skip_autopsy": skip_autopsy,
        "repeat_explore": repeat_explore,
        "binges": binges,
    }


def compute_streaks(df: pd.DataFrame) -> dict:
    """Listening streaks: consecutive days with at least one play."""
    df = df.copy()
    df["date"] = df["ts"].dt.date

    # Daily stats
    daily = df.groupby("date").agg(
        plays=("ts", "count"),
        hours=("ms_played", lambda x: round(x.sum() / 3600000, 2)),
    ).reset_index()
    daily["date"] = pd.to_datetime(daily["date"])
    daily = daily.sort_values("date")

    # Calendar data for heatmap
    calendar_data = [
        {"date": row["date"].strftime("%Y-%m-%d"), "plays": int(row["plays"]), "hours": float(row["hours"])}
        for _, row in daily.iterrows()
    ]

    # Compute streaks
    dates_set = set(daily["date"].dt.date)
    all_dates = pd.date_range(daily["date"].min(), daily["date"].max(), freq="D")

    streaks = []
    current_start = None
    current_len = 0

    for d in all_dates:
        if d.date() in dates_set:
            if current_start is None:
                current_start = d
            current_len += 1
        else:
            if current_len > 0:
                streaks.append({
                    "start": current_start.strftime("%Y-%m-%d"),
                    "end": (current_start + pd.Timedelta(days=current_len - 1)).strftime("%Y-%m-%d"),
                    "days": current_len,
                })
            current_start = None
            current_len = 0

    # Don't forget the last streak
    if current_len > 0:
        streaks.append({
            "start": current_start.strftime("%Y-%m-%d"),
            "end": (current_start + pd.Timedelta(days=current_len - 1)).strftime("%Y-%m-%d"),
            "days": current_len,
        })

    streaks.sort(key=lambda s: s["days"], reverse=True)
    longest = streaks[0] if streaks else {"start": "", "end": "", "days": 0}

    # Current streak (from most recent date backwards)
    last_date = daily["date"].max().date()
    current_streak = 0
    check_date = last_date
    while check_date in dates_set:
        current_streak += 1
        check_date = check_date - pd.Timedelta(days=1)

    # Total active days
    total_days = len(dates_set)
    total_possible = (daily["date"].max() - daily["date"].min()).days + 1

    return {
        "current_streak": current_streak,
        "longest_streak": longest,
        "top_streaks": streaks[:10],
        "total_active_days": total_days,
        "total_possible_days": total_possible,
        "active_pct": round(total_days / total_possible * 100, 1) if total_possible > 0 else 0,
        "calendar": calendar_data,
    }


def compute_artist_journeys(df: pd.DataFrame) -> dict:
    """Monthly play timeline for top artists — discovery, peak, drift."""
    df = df.copy()
    df["month"] = df["ts"].dt.to_period("M").astype(str)

    # Only artists with 100+ plays
    artist_plays = df["master_metadata_album_artist_name"].value_counts()
    top_artists = artist_plays[artist_plays >= 100].index.tolist()[:30]

    journeys = {}
    for artist in top_artists:
        artist_df = df[df["master_metadata_album_artist_name"] == artist]
        monthly = artist_df.groupby("month").agg(
            plays=("ts", "count"),
            hours=("ms_played", lambda x: round(x.sum() / 3600000, 2)),
        ).reset_index()

        discovery = monthly.iloc[0]["month"] if len(monthly) > 0 else ""
        peak_row = monthly.loc[monthly["plays"].idxmax()] if len(monthly) > 0 else None
        peak_month = peak_row["month"] if peak_row is not None else ""
        peak_plays = int(peak_row["plays"]) if peak_row is not None else 0

        # Recent activity: plays in last 3 months
        all_months = sorted(monthly["month"].unique())
        last_3 = all_months[-3:] if len(all_months) >= 3 else all_months
        recent_plays = int(monthly[monthly["month"].isin(last_3)]["plays"].sum())

        journeys[artist] = {
            "timeline": monthly.to_dict("records"),
            "discovery": discovery,
            "peak_month": peak_month,
            "peak_plays": peak_plays,
            "total_plays": int(artist_plays[artist]),
            "recent_plays": recent_plays,
        }

    return {
        "artists": top_artists,
        "data": journeys,
    }


def compute_skip_autopsy(df: pd.DataFrame) -> dict:
    """Most skipped and never skipped artists/tracks."""
    df = df.copy()
    df["is_skipped"] = (df["skipped"] == True) | (df["reason_end"] == "fwdbtn") | (df["ms_played"] < 30000)

    # --- Most skipped artists ---
    artist_skips = df.groupby("master_metadata_album_artist_name").agg(
        total_plays=("ts", "count"),
        skips=("is_skipped", "sum"),
    ).reset_index()
    artist_skips["skip_rate"] = (artist_skips["skips"] / artist_skips["total_plays"]).round(3)

    # Only artists with 20+ plays
    artist_skips = artist_skips[artist_skips["total_plays"] >= 20]

    most_skipped_artists = (
        artist_skips.sort_values("skip_rate", ascending=False)
        .head(15)
        .rename(columns={"master_metadata_album_artist_name": "artist"})
        [["artist", "skip_rate", "skips", "total_plays"]]
        .to_dict("records")
    )

    # --- Never skipped artists (min 30 plays, 0 skips) ---
    never_skipped_artists = (
        artist_skips[artist_skips["skips"] == 0]
        .sort_values("total_plays", ascending=False)
        .head(15)
        .rename(columns={"master_metadata_album_artist_name": "artist"})
        [["artist", "total_plays"]]
        .to_dict("records")
    )

    # --- Most skipped tracks ---
    track_skips = df.groupby(["master_metadata_track_name", "master_metadata_album_artist_name"]).agg(
        total_plays=("ts", "count"),
        skips=("is_skipped", "sum"),
    ).reset_index()
    track_skips["skip_rate"] = (track_skips["skips"] / track_skips["total_plays"]).round(3)
    track_skips = track_skips[track_skips["total_plays"] >= 10]

    most_skipped_tracks = (
        track_skips.sort_values("skip_rate", ascending=False)
        .head(15)
        .rename(columns={"master_metadata_track_name": "track", "master_metadata_album_artist_name": "artist"})
        [["track", "artist", "skip_rate", "skips", "total_plays"]]
        .to_dict("records")
    )

    # --- Never skipped tracks (min 15 plays) ---
    never_skipped_tracks = (
        track_skips[(track_skips["skips"] == 0) & (track_skips["total_plays"] >= 15)]
        .sort_values("total_plays", ascending=False)
        .head(15)
        .rename(columns={"master_metadata_track_name": "track", "master_metadata_album_artist_name": "artist"})
        [["track", "artist", "total_plays"]]
        .to_dict("records")
    )

    return {
        "most_skipped_artists": most_skipped_artists,
        "never_skipped_artists": never_skipped_artists,
        "most_skipped_tracks": most_skipped_tracks,
        "never_skipped_tracks": never_skipped_tracks,
    }


def compute_repeat_explore(df: pd.DataFrame) -> dict:
    """Monthly ratio of repeat listens vs new discoveries."""
    df = df.copy()
    df["month"] = df["ts"].dt.to_period("M").astype(str)
    df = df.sort_values("ts")

    # Track first-ever play date for each track
    first_play = df.groupby("spotify_track_uri")["month"].first().to_dict()

    monthly_data = []
    for month, group in df.groupby("month"):
        total = len(group)
        new_count = sum(1 for _, row in group.iterrows() if first_play.get(row["spotify_track_uri"]) == month)
        repeat_count = total - new_count
        new_tracks = group[group.apply(lambda r: first_play.get(r["spotify_track_uri"]) == month, axis=1)]["spotify_track_uri"].nunique()

        monthly_data.append({
            "month": str(month),
            "total": int(total),
            "new_plays": int(new_count),
            "repeat_plays": int(repeat_count),
            "new_pct": round(new_count / total * 100, 1) if total > 0 else 0,
            "repeat_pct": round(repeat_count / total * 100, 1) if total > 0 else 0,
            "new_tracks_discovered": int(new_tracks),
        })

    # Overall stats
    total_unique = df["spotify_track_uri"].nunique()

    return {
        "monthly": monthly_data,
        "total_unique_tracks": total_unique,
    }


def compute_binges(df: pd.DataFrame) -> dict:
    """Detect consecutive plays of the same artist."""
    df = df.copy().sort_values("ts").reset_index(drop=True)

    binges = []
    current_artist = None
    current_start = None
    current_count = 0
    current_ms = 0
    current_tracks = set()

    for _, row in df.iterrows():
        artist = row["master_metadata_album_artist_name"]
        if artist == current_artist:
            current_count += 1
            current_ms += row["ms_played"]
            current_tracks.add(row["master_metadata_track_name"])
        else:
            if current_count >= 8:
                binges.append({
                    "artist": current_artist,
                    "track_count": current_count,
                    "unique_tracks": len(current_tracks),
                    "hours": round(current_ms / 3600000, 2),
                    "date": current_start.strftime("%Y-%m-%d") if current_start else "",
                })
            current_artist = artist
            current_start = row["ts"]
            current_count = 1
            current_ms = row["ms_played"]
            current_tracks = {row["master_metadata_track_name"]}

    # Final run
    if current_count >= 8:
        binges.append({
            "artist": current_artist,
            "track_count": current_count,
            "unique_tracks": len(current_tracks),
            "hours": round(current_ms / 3600000, 2),
            "date": current_start.strftime("%Y-%m-%d") if current_start else "",
        })

    binges.sort(key=lambda b: b["track_count"], reverse=True)

    # Top binge artists (most total binge sessions)
    binge_artist_counts = {}
    for b in binges:
        binge_artist_counts[b["artist"]] = binge_artist_counts.get(b["artist"], 0) + 1
    top_binge_artists = sorted(binge_artist_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    return {
        "top_binges": binges[:20],
        "total_binge_sessions": len(binges),
        "top_binge_artists": [{"artist": a, "binge_count": c} for a, c in top_binge_artists],
    }
