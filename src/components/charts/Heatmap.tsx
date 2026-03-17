"use client";

import { habits } from "@/lib/data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "rgba(30, 215, 96, 0.03)";
  const intensity = Math.sqrt(value / max);
  // Gradient from deep blue-green to bright green
  const r = Math.round(10 + intensity * 20);
  const g = Math.round(20 + intensity * 195);
  const b = Math.round(30 + intensity * 66);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Heatmap() {
  const data = habits.heatmap;
  const allValues = data.flat();
  const maxVal = Math.max(...allValues);

  const cellWidth = 16;
  const cellHeight = 16;
  const cellGap = 2;
  const labelWidth = 32;
  const labelHeight = 20;
  const totalWidth = labelWidth + 24 * (cellWidth + cellGap);
  const totalHeight = labelHeight + 7 * (cellHeight + cellGap);

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs text-sp-text-muted uppercase tracking-wider font-semibold mb-4">
        Listening Heatmap — Day of Week × Hour of Day
      </h3>
      <div className="overflow-x-auto">
        <svg
          width={totalWidth}
          height={totalHeight}
          style={{ display: "block", margin: "0 auto" }}
        >
          {/* Hour labels */}
          {Array.from({ length: 24 }, (_, h) => (
            <text
              key={h}
              x={labelWidth + h * (cellWidth + cellGap) + cellWidth / 2}
              y={14}
              textAnchor="middle"
              fill="#4A4A62"
              fontSize={8}
              fontFamily="Outfit"
            >
              {h % 4 === 0 ? `${h}h` : ""}
            </text>
          ))}

          {/* Day labels + cells */}
          {data.map((row, dayIdx) => (
            <g key={dayIdx}>
              <text
                x={labelWidth - 4}
                y={labelHeight + dayIdx * (cellHeight + cellGap) + cellHeight / 2 + 4}
                textAnchor="end"
                fill="#4A4A62"
                fontSize={9}
                fontFamily="Outfit"
              >
                {DAYS[dayIdx]}
              </text>
              {row.map((val, hourIdx) => (
                <g key={hourIdx}>
                  <title>{`${DAYS[dayIdx]} ${hourIdx}:00 — ${val.toLocaleString()} streams`}</title>
                  <rect
                    x={labelWidth + hourIdx * (cellWidth + cellGap)}
                    y={labelHeight + dayIdx * (cellHeight + cellGap)}
                    width={cellWidth}
                    height={cellHeight}
                    rx={2}
                    fill={getColor(val, maxVal)}
                  />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px]" style={{ color: "#4A4A62" }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <div
            key={v}
            style={{
              backgroundColor: getColor(v * maxVal, maxVal),
              width: 12,
              height: 12,
              borderRadius: 2,
            }}
          />
        ))}
        <span className="text-[10px]" style={{ color: "#4A4A62" }}>More</span>
      </div>
    </div>
  );
}
