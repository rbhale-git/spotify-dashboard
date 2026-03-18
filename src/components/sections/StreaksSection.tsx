import SectionHeader from "@/components/ui/SectionHeader";
import ScrollableList from "@/components/ui/ScrollableList";
import StatCard from "@/components/ui/StatCard";
import { insights } from "@/lib/data";

const TICK_STYLE = { fill: "#9999B0", fontSize: 11, fontFamily: "Outfit" };

function CalendarHeatmap() {
  const { calendar } = insights.streaks;

  // Build a lookup map for plays by date
  const playsMap: Record<string, number> = {};
  let maxPlays = 0;
  for (const entry of calendar) {
    playsMap[entry.date] = entry.plays;
    if (entry.plays > maxPlays) maxPlays = entry.plays;
  }

  // Find the most recent 12 months in the data
  const allDates = calendar.map((c) => c.date).sort();
  const lastDate = new Date(allDates[allDates.length - 1]);
  const startDate = new Date(lastDate);
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1);

  // Find the Sunday on or before startDate
  const gridStart = new Date(startDate);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  // Build all weeks from gridStart to lastDate
  const weeks: Date[][] = [];
  const cur = new Date(gridStart);
  while (cur <= lastDate) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels: find where each month starts in the week grid
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week[0];
    if (firstDay.getMonth() !== lastMonth && firstDay >= startDate) {
      monthLabels.push({
        label: firstDay.toLocaleString("default", { month: "short" }),
        weekIndex: wi,
      });
      lastMonth = firstDay.getMonth();
    }
  });

  const cellSize = 12;
  const gap = 3;
  const leftPad = 22; // for day-of-week labels
  const topPad = 22; // for month labels
  const svgWidth = leftPad + weeks.length * (cellSize + gap);
  const svgHeight = topPad + 7 * (cellSize + gap);

  function getColor(plays: number): string {
    if (!plays) return "#1a1a2e";
    const pct = plays / Math.max(maxPlays, 1);
    if (pct < 0.15) return "#1a3d2b";
    if (pct < 0.35) return "#1a5e3a";
    if (pct < 0.6) return "#1ED760";
    if (pct < 0.8) return "#22e866";
    return "#4cff88";
  }

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="glass-card p-6 overflow-x-auto">
      <h3
        className="text-xs uppercase tracking-wider font-semibold mb-5"
        style={{ color: "#8B8BA3" }}
      >
        Daily Listening Heatmap
      </h3>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: "block", minWidth: svgWidth }}
      >
        {/* Month labels */}
        {monthLabels.map((ml) => (
          <text
            key={ml.label + ml.weekIndex}
            x={leftPad + ml.weekIndex * (cellSize + gap)}
            y={14}
            style={TICK_STYLE}
          >
            {ml.label}
          </text>
        ))}

        {/* Day-of-week labels (M, W, F only) */}
        {[1, 3, 5].map((dow) => (
          <text
            key={dow}
            x={leftPad - 6}
            y={topPad + dow * (cellSize + gap) + cellSize - 2}
            textAnchor="end"
            style={{ ...TICK_STYLE, fontSize: 9 }}
          >
            {dayLabels[dow]}
          </text>
        ))}

        {/* Cells */}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const ds = toDateStr(day);
            const plays = playsMap[ds] ?? 0;
            const inRange = day >= startDate && day <= lastDate;
            return (
              <rect
                key={ds}
                x={leftPad + wi * (cellSize + gap)}
                y={topPad + di * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={inRange ? getColor(plays) : "transparent"}
              >
                {inRange && plays > 0 && (
                  <title>{ds}: {plays} plays</title>
                )}
              </rect>
            );
          })
        )}
      </svg>
      <div className="flex items-center gap-2 mt-3">
        <span style={{ ...TICK_STYLE, fontSize: 10 }}>Less</span>
        {["#1a1a2e", "#1a3d2b", "#1a5e3a", "#1ED760", "#4cff88"].map((c) => (
          <div
            key={c}
            style={{
              width: 10,
              height: 10,
              backgroundColor: c,
              borderRadius: 2,
            }}
          />
        ))}
        <span style={{ ...TICK_STYLE, fontSize: 10 }}>More</span>
      </div>
    </div>
  );
}

export default function StreaksSection() {
  const { streaks } = insights;

  const topStreakItems = streaks.top_streaks.slice(0, 10).map((s) => ({
    primary: `${s.start} → ${s.end}`,
    secondary: "",
    detail: `${s.days}d`,
  }));

  return (
    <section className="mb-12">
      <SectionHeader
        id="streaks"
        title="Streaks"
        subtitle="Consecutive listening days, activity patterns, and your all-time streaks"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          value={`${streaks.current_streak}d`}
          label="Current Streak"
          color="text-sp-green"
          delay={0}
        />
        <StatCard
          value={`${streaks.longest_streak.days}d`}
          label="Longest Streak"
          color="text-sp-green"
          delay={1}
        />
        <StatCard
          value={`${streaks.active_pct}%`}
          label="Active Days"
          color="text-sp-teal"
          delay={2}
        />
      </div>

      <div className="mb-6">
        <CalendarHeatmap />
      </div>

      <ScrollableList
        title="Top Streaks"
        items={topStreakItems}
        maxHeight="280px"
      />
    </section>
  );
}
