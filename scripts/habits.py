import pandas as pd
import numpy as np


def compute_habits(df: pd.DataFrame) -> dict:
    """Compute listening habits: heatmap, seasonal overlay, hourly distribution."""
    df = df.copy()
    df["hour"] = df["ts"].dt.hour
    df["weekday"] = df["ts"].dt.weekday

    heatmap = np.zeros((7, 24), dtype=int)
    counts = df.groupby(["weekday", "hour"]).size().reset_index(name="count")
    for _, row in counts.iterrows():
        heatmap[int(row["weekday"])][int(row["hour"])] = int(row["count"])
    heatmap_list = heatmap.tolist()

    hourly = df.groupby("hour").size().reindex(range(24), fill_value=0)
    hourly_distribution = [
        {"hour": int(h), "streams": int(c)} for h, c in hourly.items()
    ]

    df["month_of_year"] = df["ts"].dt.month
    df["year"] = df["ts"].dt.year
    seasonal = df.groupby(["month_of_year", "year"]).agg(
        hours=("ms_played", lambda x: round(x.sum() / 3600000, 1))
    ).reset_index()
    seasonal_overlay = seasonal.to_dict("records")
    for entry in seasonal_overlay:
        entry["month_of_year"] = int(entry["month_of_year"])
        entry["year"] = int(entry["year"])

    return {
        "heatmap": heatmap_list,
        "seasonal_overlay": seasonal_overlay,
        "hourly_distribution": hourly_distribution,
    }
