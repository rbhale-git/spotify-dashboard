import pandas as pd
import numpy as np
import math
from scipy.spatial.distance import cosine
from sklearn.cluster import AgglomerativeClustering
from sklearn.feature_extraction.text import TfidfTransformer


def compute_recommendations(df: pd.DataFrame) -> dict:
    """Compute genre clusters, radar data, suggested artists, and genre timeline."""
    df = df.copy()

    df = df.sort_values("ts").reset_index(drop=True)
    gap_threshold = pd.Timedelta(minutes=30)
    time_diffs = df["ts"].diff()
    session_starts = (time_diffs > gap_threshold) | (time_diffs.isna())
    df["session_id"] = session_starts.cumsum()

    artist_plays = df["master_metadata_album_artist_name"].value_counts()
    core_artists = artist_plays[artist_plays >= 10].index.tolist()

    if len(core_artists) < 2:
        return _empty_result()

    artist_to_idx = {a: i for i, a in enumerate(core_artists)}
    n = len(core_artists)
    cooccurrence = np.zeros((n, n), dtype=float)

    for _, group in df.groupby("session_id"):
        session_artists = set(group["master_metadata_album_artist_name"].unique()) & set(core_artists)
        artist_indices = [artist_to_idx[a] for a in session_artists]
        for i in artist_indices:
            for j in artist_indices:
                if i != j:
                    cooccurrence[i][j] += 1

    transformer = TfidfTransformer()
    cooccurrence_tfidf = transformer.fit_transform(cooccurrence).toarray()

    n_clusters = min(8, n)
    clustering = AgglomerativeClustering(n_clusters=n_clusters, linkage="ward")
    labels = clustering.fit_predict(cooccurrence_tfidf)

    clusters = {}
    for artist, label in zip(core_artists, labels):
        label = int(label)
        if label not in clusters:
            clusters[label] = []
        clusters[label].append(artist)

    centroids = {}
    for label, artists in clusters.items():
        indices = [artist_to_idx[a] for a in artists]
        centroids[label] = cooccurrence_tfidf[indices].mean(axis=0)

    genre_clusters = []
    cluster_play_time = {}
    for label, artists in clusters.items():
        artist_play_counts = [(a, int(artist_plays[a])) for a in artists]
        artist_play_counts.sort(key=lambda x: x[1], reverse=True)
        top3 = [a for a, _ in artist_play_counts[:3]]
        total_ms = df[df["master_metadata_album_artist_name"].isin(artists)]["ms_played"].sum()
        cluster_play_time[label] = total_ms

        genre_clusters.append({
            "cluster_id": label,
            "label": ", ".join(top3),
            "top_artists": top3,
            "affinity": 0,
        })

    total_time = sum(cluster_play_time.values())
    for gc in genre_clusters:
        gc["affinity"] = round(cluster_play_time[gc["cluster_id"]] / total_time, 3) if total_time > 0 else 0

    radar_data = [{"genre": gc["label"], "value": gc["affinity"]} for gc in genre_clusters]

    all_artist_cluster = {}
    for artist, label in zip(core_artists, labels):
        all_artist_cluster[artist] = int(label)

    low_play_artists = artist_plays[artist_plays < 10].index.tolist()
    for artist in low_play_artists:
        artist_sessions = df[df["master_metadata_album_artist_name"] == artist]["session_id"].unique()
        session_coartists = df[df["session_id"].isin(artist_sessions)]["master_metadata_album_artist_name"]
        core_coartists = [a for a in session_coartists if a in artist_to_idx]
        if core_coartists:
            vec = np.mean([cooccurrence_tfidf[artist_to_idx[a]] for a in core_coartists], axis=0)
            best_label = min(centroids.keys(), key=lambda l: cosine(vec, centroids[l]) if np.any(centroids[l]) else float("inf"))
            all_artist_cluster[artist] = best_label

    top_clusters = sorted(cluster_play_time, key=cluster_play_time.get, reverse=True)
    top_half = set(top_clusters[:len(top_clusters) // 2 + 1])

    candidates = []
    for artist in low_play_artists:
        if artist not in all_artist_cluster:
            continue
        cluster_label = all_artist_cluster[artist]
        if cluster_label not in top_half:
            continue
        plays = int(artist_plays[artist])
        if plays >= 3:
            continue

        cluster_artists_plays = [int(artist_plays[a]) for a in clusters.get(cluster_label, []) if a in artist_plays]
        median_plays = float(np.median(cluster_artists_plays)) if cluster_artists_plays else 1
        affinity = cluster_play_time.get(cluster_label, 0) / total_time if total_time > 0 else 0
        familiarity = math.log2(plays + 1) / math.log2(median_plays + 1) if median_plays > 0 else 0
        score = affinity * (1 - min(familiarity, 1.0))

        cluster_info = next((gc for gc in genre_clusters if gc["cluster_id"] == cluster_label), None)
        candidates.append({
            "artist": artist,
            "cluster": cluster_info["label"] if cluster_info else "Unknown",
            "match_pct": int(round(score * 100)),
            "current_plays": plays,
        })

    candidates.sort(key=lambda x: x["match_pct"], reverse=True)
    suggested_artists = candidates[:10]

    df["month"] = df["ts"].dt.to_period("M").astype(str)
    df["cluster"] = df["master_metadata_album_artist_name"].map(all_artist_cluster)

    genre_timeline = []
    for month, group in df.groupby("month"):
        entry = {"month": str(month)}
        total_ms_month = group["ms_played"].sum()
        for gc in genre_clusters:
            cluster_ms = group[group["cluster"] == gc["cluster_id"]]["ms_played"].sum()
            entry[gc["label"]] = round(cluster_ms / total_ms_month, 3) if total_ms_month > 0 else 0
        genre_timeline.append(entry)

    return {
        "genre_clusters": genre_clusters,
        "radar_data": radar_data,
        "suggested_artists": suggested_artists,
        "genre_timeline": genre_timeline,
    }


def compute_recommendations_by_period(df: pd.DataFrame) -> dict:
    """Compute recommendations for all time + each 6-month period."""
    df = df.copy()
    df["ts"] = pd.to_datetime(df["ts"], utc=True)

    # Generate 6-month period boundaries
    min_date = df["ts"].min().tz_localize(None)
    max_date = df["ts"].max().tz_localize(None)

    periods = []
    # Determine the starting half: H1 = Jan-Jun, H2 = Jul-Dec
    year = min_date.year
    half = 1 if min_date.month <= 6 else 2
    while True:
        start_month = 1 if half == 1 else 7
        end_month = 6 if half == 1 else 12
        start = pd.Timestamp(f"{year}-{start_month:02d}-01")
        end = pd.Timestamp(f"{year}-{end_month:02d}-01") + pd.offsets.MonthEnd(0) + pd.Timedelta(hours=23, minutes=59, seconds=59)
        label = f"{year} H{half}"

        if start > max_date:
            break

        periods.append({"label": label, "start": start, "end": end})

        if half == 1:
            half = 2
        else:
            half = 1
            year += 1

    result = {}

    # All time
    print("    Computing: All Time")
    result["All Time"] = compute_recommendations(df)

    # Per period
    for p in periods:
        period_df = df[(df["ts"].dt.tz_localize(None) >= p["start"]) & (df["ts"].dt.tz_localize(None) <= p["end"])]
        if len(period_df) < 50:
            continue
        print(f"    Computing: {p['label']} ({len(period_df)} records)")
        result[p["label"]] = compute_recommendations(period_df)

    # Return structure: { periods: ["All Time", "2018 H2", ...], data: { "All Time": {...}, ... } }
    period_labels = [k for k in result.keys()]
    return {
        "periods": period_labels,
        "data": result,
    }


def _empty_result() -> dict:
    return {
        "genre_clusters": [],
        "radar_data": [],
        "suggested_artists": [],
        "genre_timeline": [],
    }
