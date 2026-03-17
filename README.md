# Spotify Listening Analytics Dashboard

A personal analytics dashboard visualizing 8 years of Spotify Extended Streaming History (Sep 2018 - Mar 2026). Pre-processed with Python, rendered as a static Next.js site.

**130,426 streams | 7+ years | 5 interactive sections**

## Sections

- **Overview** — Total streams, hours, unique tracks/artists, monthly volume timeline, platform breakdown
- **Listening Habits** — Hour-of-day x day-of-week heatmap, seasonal listening patterns by year, hourly distribution
- **Deep Cuts** — Artist loyalty scores, one-hit wonders, most replayed tracks, hidden gems, diversity index (Shannon entropy)
- **Sessions** — Skip rate trends, session length distribution, shuffle rate, start/end reason breakdown
- **Recommendations** — Genre clusters via co-listening analysis, artist suggestions, genre timeline with **6-month period selector** (17 periods from 2018 H2 to 2026 H1)

## Tech Stack

| Layer | Tech |
|-------|------|
| Data Processing | Python 3, pandas, scikit-learn, scipy |
| Frontend | Next.js 16, React 19, TypeScript |
| Charts | Recharts, custom SVG (heatmap) |
| Styling | Tailwind CSS 4, Google Fonts (Syne + Outfit) |
| Output | Static HTML export (no server required) |

## Architecture

```
Spotify Extended Streaming History (105MB, 9 JSON files)
  -> scripts/process.py (pandas pipeline)
    -> data/*.json (6 compact summary files, ~200KB total)
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
| `deep_cuts.py` | Loyalty scores, one-hit wonders, hidden gems, diversity entropy |
| `recommendations.py` | Co-listening clustering (Ward/TF-IDF), artist suggestions per 6-month period |

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
# Default path: C:\Users\ronak\Spotify Extended Streaming History
python process.py

# Or specify a custom path:
SPOTIFY_DATA_DIR="/path/to/your/data" python process.py
```

This generates 6 JSON files in `data/`.

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
    deep_cuts.py            # Loyalty, one-hits, gems, diversity
    recommendations.py      # Genre clustering + period-based suggestions
    test_processing.py      # 29 tests for all modules
  data/                     # Pre-processed JSON (gitignored)
  src/
    app/
      layout.tsx            # Root layout with sidebar
      page.tsx              # Main page assembling all sections
      globals.css           # Tailwind v4 theme + glass card styles
    components/
      ui/                   # Sidebar, StatCard, SectionHeader, ScrollableList
      charts/               # 11 chart components (Recharts + custom SVG)
      sections/             # 5 section components composing charts
    lib/
      data.ts               # Typed static JSON imports
```

## Running Tests

```bash
cd scripts
python -m pytest test_processing.py -v
```

29 tests covering data cleaning, overview stats, session detection, skip logic, heatmap shape, loyalty scores, one-hit wonders, diversity index, and genre clustering.
