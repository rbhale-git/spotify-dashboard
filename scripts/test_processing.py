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
