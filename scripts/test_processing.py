import pytest
from cleaning import load_raw_data, clean_data, normalize_platform

def test_clean_data_filters_null_tracks():
    raw = [
        {"ts": "2024-01-01T00:00:00Z", "master_metadata_track_name": "Track A", "ms_played": 180000, "platform": "ios"},
        {"ts": "2024-01-01T00:01:00Z", "master_metadata_track_name": None, "ms_played": 180000, "platform": "ios"},
    ]
    import pandas as pd
    df = pd.DataFrame(raw)
    cleaned, filtered_count = clean_data(df)
    assert len(cleaned) == 1
    assert filtered_count == 1
    assert cleaned.iloc[0]["master_metadata_track_name"] == "Track A"

def test_clean_data_filters_zero_ms_played():
    raw = [
        {"ts": "2024-01-01T00:00:00Z", "master_metadata_track_name": "Track A", "ms_played": 180000, "platform": "ios"},
        {"ts": "2024-01-01T00:01:00Z", "master_metadata_track_name": "Track B", "ms_played": 0, "platform": "ios"},
    ]
    import pandas as pd
    df = pd.DataFrame(raw)
    cleaned, filtered_count = clean_data(df)
    assert len(cleaned) == 1
    assert filtered_count == 1

def test_normalize_platform_ios():
    assert normalize_platform("ios") == "iOS"
    assert normalize_platform("iOS 15.6.1 (iPhone14,3)") == "iOS"

def test_normalize_platform_android():
    assert normalize_platform("android") == "Android"
    assert normalize_platform("Android OS 10 API 29 (samsung, SM-G965F)") == "Android"

def test_normalize_platform_windows():
    assert normalize_platform("windows") == "Windows"
    assert normalize_platform("Windows 10 (10.0.22000; x64; AppX)") == "Windows"

def test_normalize_platform_web():
    assert normalize_platform("web_player windows 10;chrome 91.0.4472.77;desktop") == "Web"

def test_normalize_platform_tv():
    assert normalize_platform("Partner tizen_tv samsung;qa65q7fam") == "TV"
    assert normalize_platform("tizen") == "TV"

def test_normalize_platform_console():
    assert normalize_platform("playstation") == "Console"
    assert normalize_platform("xbox") == "Console"

def test_normalize_platform_other():
    assert normalize_platform("not_applicable") == "Other"
    assert normalize_platform("cast") == "Other"

from overview import compute_overview
import pandas as pd

def make_test_df():
    """Create a small test DataFrame for overview tests."""
    records = [
        {"ts": "2024-01-15T10:00:00Z", "ms_played": 180000, "platform": "iOS",
         "master_metadata_track_name": "Track A", "master_metadata_album_artist_name": "Artist 1",
         "spotify_track_uri": "spotify:track:aaa"},
        {"ts": "2024-01-15T10:03:00Z", "ms_played": 240000, "platform": "iOS",
         "master_metadata_track_name": "Track B", "master_metadata_album_artist_name": "Artist 2",
         "spotify_track_uri": "spotify:track:bbb"},
        {"ts": "2024-02-20T14:00:00Z", "ms_played": 200000, "platform": "Windows",
         "master_metadata_track_name": "Track A", "master_metadata_album_artist_name": "Artist 1",
         "spotify_track_uri": "spotify:track:aaa"},
    ]
    df = pd.DataFrame(records)
    df["ts"] = pd.to_datetime(df["ts"])
    return df

def test_overview_hero_stats():
    df = make_test_df()
    result = compute_overview(df)
    assert result["hero_stats"]["total_streams"] == 3
    assert result["hero_stats"]["unique_tracks"] == 2
    assert result["hero_stats"]["unique_artists"] == 2
    expected_hours = round((180000 + 240000 + 200000) / 3600000, 1)
    assert result["hero_stats"]["total_hours"] == expected_hours

def test_overview_monthly_volume():
    df = make_test_df()
    result = compute_overview(df)
    months = {m["month"]: m for m in result["monthly_volume"]}
    assert "2024-01" in months
    assert "2024-02" in months
    assert months["2024-01"]["streams"] == 2

def test_overview_platform_breakdown():
    df = make_test_df()
    result = compute_overview(df)
    platforms = {p["platform"]: p for p in result["platform_breakdown"]}
    assert "iOS" in platforms
    assert "Windows" in platforms
    assert platforms["iOS"]["streams"] == 2

from sessions import detect_sessions, compute_sessions, is_skipped

def test_is_skipped_by_reason():
    assert is_skipped(reason_end="fwdbtn", ms_played=180000, skipped=False) is True

def test_is_skipped_by_ms_played():
    assert is_skipped(reason_end="trackdone", ms_played=15000, skipped=False) is True

def test_is_skipped_by_field():
    assert is_skipped(reason_end="trackdone", ms_played=180000, skipped=True) is True

def test_not_skipped():
    assert is_skipped(reason_end="trackdone", ms_played=180000, skipped=False) is False

def test_detect_sessions_gap():
    """Two plays 2 hours apart should be 2 sessions."""
    records = [
        {"ts": pd.Timestamp("2024-01-15T10:00:00Z"), "ms_played": 180000, "shuffle": False,
         "reason_end": "trackdone", "skipped": False, "platform": "iOS"},
        {"ts": pd.Timestamp("2024-01-15T12:00:00Z"), "ms_played": 180000, "shuffle": False,
         "reason_end": "trackdone", "skipped": False, "platform": "iOS"},
    ]
    df = pd.DataFrame(records)
    sessions = detect_sessions(df)
    assert len(sessions) == 2

def test_detect_sessions_continuous():
    """Two plays 3 minutes apart should be 1 session."""
    records = [
        {"ts": pd.Timestamp("2024-01-15T10:00:00Z"), "ms_played": 180000, "shuffle": False,
         "reason_end": "trackdone", "skipped": False, "platform": "iOS"},
        {"ts": pd.Timestamp("2024-01-15T10:03:00Z"), "ms_played": 180000, "shuffle": True,
         "reason_end": "fwdbtn", "skipped": False, "platform": "iOS"},
    ]
    df = pd.DataFrame(records)
    sessions = detect_sessions(df)
    assert len(sessions) == 1
    assert sessions[0]["track_count"] == 2
    assert sessions[0]["skip_count"] == 1

from habits import compute_habits

def test_heatmap_shape():
    records = [
        {"ts": pd.Timestamp("2024-01-15T10:00:00Z"), "ms_played": 180000},
        {"ts": pd.Timestamp("2024-01-16T14:00:00Z"), "ms_played": 180000},
    ]
    df = pd.DataFrame(records)
    result = compute_habits(df)
    assert len(result["heatmap"]) == 7
    assert len(result["heatmap"][0]) == 24

def test_heatmap_values():
    records = [
        {"ts": pd.Timestamp("2024-01-15T10:00:00Z"), "ms_played": 180000},
    ]
    df = pd.DataFrame(records)
    result = compute_habits(df)
    assert result["heatmap"][0][10] == 1

def test_hourly_distribution():
    records = [
        {"ts": pd.Timestamp("2024-01-15T10:00:00Z"), "ms_played": 180000},
        {"ts": pd.Timestamp("2024-01-16T10:00:00Z"), "ms_played": 180000},
        {"ts": pd.Timestamp("2024-01-16T14:00:00Z"), "ms_played": 180000},
    ]
    df = pd.DataFrame(records)
    result = compute_habits(df)
    hourly = {h["hour"]: h["streams"] for h in result["hourly_distribution"]}
    assert hourly[10] == 2
    assert hourly[14] == 1

def test_seasonal_overlay():
    records = [
        {"ts": pd.Timestamp("2024-01-15T10:00:00Z"), "ms_played": 3600000},
        {"ts": pd.Timestamp("2023-01-10T10:00:00Z"), "ms_played": 7200000},
    ]
    df = pd.DataFrame(records)
    result = compute_habits(df)
    entries = result["seasonal_overlay"]
    jan_2024 = [e for e in entries if e["month_of_year"] == 1 and e["year"] == 2024]
    assert len(jan_2024) == 1
    assert jan_2024[0]["hours"] == 1.0

from deep_cuts import compute_deep_cuts

def make_deep_cuts_df():
    records = [
        *[{"ts": pd.Timestamp(f"2020-0{i+1}-15T10:00:00Z"), "ms_played": 180000,
           "master_metadata_album_artist_name": "Loyal Artist",
           "master_metadata_track_name": f"Track {i}", "spotify_track_uri": f"uri:{i}",
           "reason_end": "trackdone"} for i in range(4)],
        *[{"ts": pd.Timestamp(f"2021-0{i+1}-15T10:00:00Z"), "ms_played": 180000,
           "master_metadata_album_artist_name": "Loyal Artist",
           "master_metadata_track_name": f"Track {i}", "spotify_track_uri": f"uri:{i}",
           "reason_end": "trackdone"} for i in range(3)],
        *[{"ts": pd.Timestamp(f"2022-0{i+1}-15T10:00:00Z"), "ms_played": 180000,
           "master_metadata_album_artist_name": "Loyal Artist",
           "master_metadata_track_name": f"Track {i}", "spotify_track_uri": f"uri:{i}",
           "reason_end": "trackdone"} for i in range(3)],
        {"ts": pd.Timestamp("2023-06-15T10:00:00Z"), "ms_played": 200000,
         "master_metadata_album_artist_name": "One Hit Artist",
         "master_metadata_track_name": "Fleeting Song", "spotify_track_uri": "uri:onehit",
         "reason_end": "trackdone"},
        *[{"ts": pd.Timestamp(f"2023-0{i+1}-15T10:00:00Z"), "ms_played": 180000,
           "master_metadata_album_artist_name": "Popular Artist",
           "master_metadata_track_name": "Hit Song", "spotify_track_uri": "uri:hit",
           "reason_end": "trackdone"} for i in range(5)],
    ]
    df = pd.DataFrame(records)
    df["ts"] = pd.to_datetime(df["ts"])
    return df

def test_loyalty_scores():
    df = make_deep_cuts_df()
    result = compute_deep_cuts(df)
    loyalty = result["loyalty_scores"]
    assert len(loyalty) > 0
    loyal = [a for a in loyalty if a["artist"] == "Loyal Artist"]
    assert len(loyal) == 1
    assert loyal[0]["years_active"] == 3

def test_one_hit_wonders():
    df = make_deep_cuts_df()
    result = compute_deep_cuts(df)
    wonders = result["one_hit_wonders"]
    wonder_tracks = [w["track"] for w in wonders]
    assert "Fleeting Song" in wonder_tracks

def test_most_replayed():
    df = make_deep_cuts_df()
    result = compute_deep_cuts(df)
    replayed = result["most_replayed"]
    assert replayed[0]["track"] == "Hit Song"
    assert replayed[0]["plays"] == 5

def test_diversity_index_excludes_low_months():
    records = [
        *[{"ts": pd.Timestamp(f"2024-01-{i+1:02d}T10:00:00Z"), "ms_played": 180000,
           "master_metadata_album_artist_name": f"Artist {i}",
           "master_metadata_track_name": f"Track {i}", "spotify_track_uri": f"uri:d{i}",
           "reason_end": "trackdone"} for i in range(5)],
        *[{"ts": pd.Timestamp(f"2024-02-{i+1:02d}T10:00:00Z"), "ms_played": 180000,
           "master_metadata_album_artist_name": f"Artist {i}",
           "master_metadata_track_name": f"Track {i}", "spotify_track_uri": f"uri:d{i}",
           "reason_end": "trackdone"} for i in range(25)],
    ]
    df = pd.DataFrame(records)
    df["ts"] = pd.to_datetime(df["ts"])
    result = compute_deep_cuts(df)
    months = [d["month"] for d in result["diversity_index"]]
    assert "2024-01" not in months
    assert "2024-02" in months
