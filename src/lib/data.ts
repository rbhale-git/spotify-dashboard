export interface Metadata {
  last_updated: string;
  processed_at: string;
  total_records_raw: number;
  total_records_clean: number;
  filtered_records: number;
  date_range: { start: string; end: string };
}

export interface OverviewData {
  hero_stats: {
    total_streams: number;
    total_hours: number;
    unique_tracks: number;
    unique_artists: number;
  };
  monthly_volume: { month: string; hours: number; streams: number }[];
  platform_breakdown: { platform: string; streams: number; percentage: number }[];
}

export interface HabitsData {
  heatmap: number[][];
  seasonal_overlay: { month_of_year: number; year: number; hours: number }[];
  hourly_distribution: { hour: number; streams: number }[];
}

export interface DeepCutsData {
  loyalty_scores: { artist: string; score: number; years_active: number; total_plays: number }[];
  one_hit_wonders: { track: string; artist: string; date: string }[];
  most_replayed: { track: string; artist: string; plays: number }[];
  hidden_gems: { track: string; artist: string; plays: number; completion_rate: number }[];
  diversity_index: { month: string; index: number }[];
}

export interface SessionsData {
  overall: {
    skip_rate: number;
    avg_session_minutes: number;
    shuffle_rate: number;
  };
  skip_trend: { month: string; skip_rate: number }[];
  length_distribution: { bucket: string; count: number }[];
  reason_start: { reason: string; count: number }[];
  reason_end: { reason: string; count: number }[];
}

export interface GenreCluster {
  cluster_id: number;
  label: string;
  top_artists: string[];
  affinity: number;
}

export interface PeriodRecommendation {
  genre_clusters: GenreCluster[];
  radar_data: { genre: string; value: number }[];
  suggested_artists: { artist: string; cluster: string; match_pct: number; current_plays: number }[];
  genre_timeline: Record<string, string | number>[];
}

export interface RecommendationsData {
  periods: string[];
  data: Record<string, PeriodRecommendation>;
}

import metadataJson from "../../data/metadata.json";
import overviewJson from "../../data/overview.json";
import habitsJson from "../../data/habits.json";
import deepCutsJson from "../../data/deep-cuts.json";
import sessionsJson from "../../data/sessions.json";
import recommendationsJson from "../../data/recommendations.json";

export const metadata = metadataJson as Metadata;
export const overview = overviewJson as OverviewData;
export const habits = habitsJson as HabitsData;
export const deepCuts = deepCutsJson as DeepCutsData;
export const sessions = sessionsJson as SessionsData;
export const recommendations = recommendationsJson as RecommendationsData;
