"use client";

import { habits } from "@/lib/data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getColor(value: number, max: number): string {
  const intensity = Math.sqrt(value / max);
  const alpha = 0.1 + intensity * 0.9;
  return `rgba(29, 185, 84, ${alpha.toFixed(2)})`;
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
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-4">
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
              fill="#6a6a6a"
              fontSize={8}
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
                fill="#6a6a6a"
                fontSize={9}
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
        <span className="text-[10px] text-spotify-text-muted">Less</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
          <div
            key={v}
            style={{ backgroundColor: `rgba(29,185,84,${v})`, width: 12, height: 12, borderRadius: 2 }}
          />
        ))}
        <span className="text-[10px] text-spotify-text-muted">More</span>
      </div>
    </div>
  );
}
