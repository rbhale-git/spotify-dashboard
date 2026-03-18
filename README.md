# Spotify Listening Analytics Dashboard

A personal analytics dashboard visualizing 8 years of Spotify Extended Streaming History (Sep 2018 - Mar 2026). Pre-processed with Python, rendered as a static Next.js site with a cinematic dark theme.

**130,426 streams | 7+ years | 9 interactive sections**

## Sections

1. **Overview** — Hero stats, monthly volume timeline, platform breakdown
2. **Listening Habits** — Hour x day heatmap, seasonal patterns by year, hourly distribution
3. **Artist Journeys** — Pick any artist and trace their timeline: discovery date, peak month, recent activity
4. **Repeat vs Explore** — Monthly ratio of new discoveries vs repeat listens, new tracks discovered over time
5. **Deep Cuts** — Favorite artists by year, loyalty scores, one-hit wonders, most replayed, hidden gems, diversity index
6. **Sessions** — Skip rate trends, session length distribution, shuffle rate, start/end reason breakdown
7. **Streaks** — Current/longest listening streaks, GitHub-style calendar heatmap, top streak history
8. **Recommendations** — Genre clusters via co-listening analysis, artist suggestions with **6-month period selector** (17 periods)
9. **Binge Score** — Longest consecutive same-artist binges, top binge artists

## Tech Stack

| Layer | Tech |
|-------|------|
| Data Processing | Python 3, pandas, scikit-learn, scipy |
| Frontend | Next.js 16, React 19, TypeScript |
| Charts | Recharts, custom SVG (heatmaps, calendar) |
| Styling | Tailwind CSS 4, Google Fonts (Syne + Outfit) |
| Design | Glassmorphic cards, noise grain texture, ambient glow effects |
| Output | Static HTML export (no server required) |

## Architecture

```
Spotify Extended Streaming History (105MB, 9 JSON files)
  -> scripts/process.py (pandas pipeline)
    -> data/*.json (7 summary files, ~650KB total)
      -> Next.js static build
        -> out/ (static HTML/CSS/JS)
```

### Processing Modules

| Module | Purpose |
|--------|---------|
| `cleaning.py` | Null filtering, platform normalization (7 categories) |
| `overview.py` | Hero stats, monthly volume, platform breakdown |
| `habits.py` | Heatmap (7x24), seasonal overlay, hourly distribution |
| `sessions.py` | Session detection (30-min gap), skip analysis, reason breakdown |
| `deep_cuts.py` | Loyalty scores, one-hit wonders, hidden gems, diversity entropy, top artists by year |
| `recommendations.py` | Co-listening clustering (Ward/TF-IDF), artist suggestions per 6-month period |
| `insights.py` | Listening streaks, artist journeys, repeat/explore ratio, binge detection |

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Your Spotify Extended Streaming History data ([request here](https://www.spotify.com/account/privacy/))

### Install Dependencies

```bash
# Python
pip install -r scripts/requirements.txt

# Node
npm install
```

### Process Your Data

Place your Spotify data files (`Streaming_History_Audio_*.json`) in a directory, then:

```bash
cd scripts
python process.py

# Or specify a custom path:
SPOTIFY_DATA_DIR="/path/to/your/data" python process.py
```

This generates 7 JSON files in `data/`.

### Build & Serve

```bash
npm run build
npx serve out
```

Open http://localhost:3000.

## Project Structure

```
spotify-dashboard/
  scripts/
    process.py              # Main pipeline entry point
    cleaning.py             # Data cleaning + platform normalization
    overview.py             # Hero stats, monthly volume
    habits.py               # Heatmap, seasonal, hourly
    sessions.py             # Session detection, skip analysis
    deep_cuts.py            # Loyalty, one-hits, gems, diversity, top artists by year
    recommendations.py      # Genre clustering + period-based suggestions
    insights.py             # Streaks, artist journeys, repeat/explore, binges
    test_processing.py      # 29 tests for all modules
  data/                     # Pre-processed JSON
  src/
    app/
      layout.tsx            # Root layout with sidebar + ambient effects
      page.tsx              # Main page assembling all 9 sections
      globals.css           # Tailwind v4 theme, glass cards, animations
      icon.svg              # Spotify-style favicon
    components/
      ui/                   # Sidebar, StatCard, SectionHeader, ScrollableList
      charts/               # 15 chart components (Recharts + custom SVG)
      sections/             # 9 section components composing charts
    lib/
      data.ts               # Typed static JSON imports
```

## Running Tests

```bash
cd scripts
python -m pytest test_processing.py -v
```

29 tests covering data cleaning, overview stats, session detection, skip logic, heatmap shape, loyalty scores, one-hit wonders, diversity index, and genre clustering.
