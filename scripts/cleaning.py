import json
import os
import glob
import pandas as pd


def load_raw_data(data_dir: str) -> pd.DataFrame:
    """Load all Streaming_History_Audio_*.json files into a single DataFrame."""
    pattern = os.path.join(data_dir, "Streaming_History_Audio_*.json")
    files = sorted(glob.glob(pattern))
    if not files:
        raise FileNotFoundError(f"No audio history files found in {data_dir}")

    all_records = []
    for f in files:
        with open(f, "r", encoding="utf-8") as fh:
            all_records.extend(json.load(fh))

    return pd.DataFrame(all_records)


def clean_data(df: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    """Filter out null tracks and zero-ms plays. Returns (cleaned_df, filtered_count)."""
    original_count = len(df)
    df = df[df["master_metadata_track_name"].notna()]
    df = df[df["ms_played"].notna() & (df["ms_played"] > 0)]
    filtered_count = original_count - len(df)
    return df.reset_index(drop=True), filtered_count


def normalize_platform(platform: str) -> str:
    """Map raw platform string to one of 7 categories."""
    if not platform or platform == "not_applicable":
        return "Other"

    p = platform.lower()

    if p == "ios" or p.startswith("ios "):
        return "iOS"
    if p == "android" or p.startswith("android "):
        return "Android"
    if p == "windows" or p.startswith("windows "):
        return "Windows"
    if p.startswith("web_player"):
        return "Web"
    if "tizen" in p or "tv" in p or p.startswith("partner"):
        return "TV"
    if p in ("playstation", "xbox"):
        return "Console"

    return "Other"
