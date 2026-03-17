import pandas as pd
import numpy as np


def is_skipped(reason_end: str, ms_played: int, skipped: bool) -> bool:
    """Hybrid skip detection: native field + behavioral signals."""
    if skipped:
        return True
    if reason_end == "fwdbtn":
        return True
    if ms_played < 30000:
        return True
    return False


def detect_sessions(df: pd.DataFrame, gap_minutes: int = 30) -> list[dict]:
    """Group plays into sessions based on time gaps."""
    df = df.sort_values("ts").reset_index(drop=True)
    gap_threshold = pd.Timedelta(minutes=gap_minutes)

    time_diffs = df["ts"].diff()
    session_starts = (time_diffs > gap_threshold) | (time_diffs.isna())
    df = df.copy()
    df["session_id"] = session_starts.cumsum()

    # Vectorized skip detection for performance
    df["is_skipped"] = (df["skipped"] == True) | (df["reason_end"] == "fwdbtn") | (df["ms_played"] < 30000)

    sessions = []
    for _, group in df.groupby("session_id"):
        sessions.append({
            "duration_ms": int(group["ms_played"].sum()),
            "track_count": len(group),
            "skip_count": int(group["is_skipped"].sum()),
            "shuffle_ratio": round(group["shuffle"].mean(), 2) if len(group) > 0 else 0,
            "platform": group["platform"].mode().iloc[0] if len(group) > 0 else "Other",
        })

    return sessions


def compute_sessions(df: pd.DataFrame) -> dict:
    """Compute all session-related stats."""
    sessions_list = detect_sessions(df)

    df = df.copy()
    df["is_skipped"] = (df["skipped"] == True) | (df["reason_end"] == "fwdbtn") | (df["ms_played"] < 30000)

    total_tracks = len(df)
    total_skipped = int(df["is_skipped"].sum())
    skip_rate = round(total_skipped / total_tracks, 3) if total_tracks > 0 else 0
    shuffle_rate = round(df["shuffle"].mean(), 3) if total_tracks > 0 else 0

    session_minutes = [s["duration_ms"] / 60000 for s in sessions_list]
    avg_session_min = round(np.mean(session_minutes), 1) if session_minutes else 0

    df["month"] = df["ts"].dt.to_period("M").astype(str)
    skip_trend = df.groupby("month")["is_skipped"].mean().round(3).reset_index().rename(columns={"is_skipped": "skip_rate"})

    buckets = {"<10min": 0, "10-30min": 0, "30-60min": 0, "1-2hr": 0, "2hr+": 0}
    for mins in session_minutes:
        if mins < 10:
            buckets["<10min"] += 1
        elif mins < 30:
            buckets["10-30min"] += 1
        elif mins < 60:
            buckets["30-60min"] += 1
        elif mins < 120:
            buckets["1-2hr"] += 1
        else:
            buckets["2hr+"] += 1

    length_distribution = [{"bucket": k, "count": v} for k, v in buckets.items()]

    reason_start = df["reason_start"].value_counts().reset_index().rename(columns={"reason_start": "reason"})
    reason_end = df["reason_end"].value_counts().reset_index().rename(columns={"reason_end": "reason"})

    return {
        "overall": {
            "skip_rate": float(skip_rate),
            "avg_session_minutes": float(avg_session_min),
            "shuffle_rate": float(shuffle_rate),
        },
        "skip_trend": skip_trend.to_dict("records"),
        "length_distribution": length_distribution,
        "reason_start": reason_start.to_dict("records"),
        "reason_end": reason_end.to_dict("records"),
    }
