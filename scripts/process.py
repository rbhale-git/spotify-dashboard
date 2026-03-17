"""Main entry point: load raw Spotify data, process all modules, write JSON output."""
import json
import os
import sys
from datetime import datetime, timezone

import pandas as pd

from cleaning import load_raw_data, clean_data, normalize_platform
from overview import compute_overview
from habits import compute_habits
from sessions import compute_sessions
from deep_cuts import compute_deep_cuts
from recommendations import compute_recommendations_by_period


DATA_DIR = os.environ.get(
    "SPOTIFY_DATA_DIR",
    r"C:\Users\ronak\Spotify Extended Streaming History",
)
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def main():
    print(f"Loading raw data from: {DATA_DIR}")
    raw_df = load_raw_data(DATA_DIR)
    total_raw = len(raw_df)
    print(f"Loaded {total_raw} raw records")

    # Clean
    df, filtered_count = clean_data(raw_df)
    print(f"Cleaned: {len(df)} records ({filtered_count} filtered)")

    # Parse timestamps
    df["ts"] = pd.to_datetime(df["ts"])

    # Normalize platforms
    df["platform"] = df["platform"].fillna("not_applicable").apply(normalize_platform)

    # Ensure output dir exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Metadata
    metadata = {
        "last_updated": df["ts"].max().isoformat() + "Z",
        "processed_at": datetime.now(timezone.utc).isoformat(),
        "total_records_raw": int(total_raw),
        "total_records_clean": int(len(df)),
        "filtered_records": int(filtered_count),
        "date_range": {
            "start": df["ts"].min().strftime("%Y-%m-%d"),
            "end": df["ts"].max().strftime("%Y-%m-%d"),
        },
    }
    write_json(metadata, "metadata.json")

    # Overview
    print("Processing overview...")
    overview = compute_overview(df)
    write_json(overview, "overview.json")

    # Habits
    print("Processing habits...")
    habits = compute_habits(df)
    write_json(habits, "habits.json")

    # Sessions
    print("Processing sessions...")
    sessions_data = compute_sessions(df)
    write_json(sessions_data, "sessions.json")

    # Deep Cuts
    print("Processing deep cuts...")
    deep_cuts = compute_deep_cuts(df)
    write_json(deep_cuts, "deep-cuts.json")

    # Recommendations (all time + per 6-month period)
    print("Processing recommendations by period...")
    recommendations = compute_recommendations_by_period(df)
    write_json(recommendations, "recommendations.json")

    print("Done! All JSON files written to:", OUTPUT_DIR)


def write_json(data: dict, filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    size_kb = os.path.getsize(path) / 1024
    print(f"  Wrote {filename} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
