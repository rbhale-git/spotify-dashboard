"use client";

import { habits } from "@/lib/data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "rgba(30, 215, 96, 0.04)";
  const intensity = Math.pow(value / max, 0.6);
  if (intensity < 0.15) return `rgba(30, 215, 96, 0.08)`;
  if (intensity < 0.3) return `rgba(30, 215, 96, 0.2)`;
  if (intensity < 0.5) return `rgba(30, 215, 96, 0.38)`;
  if (intensity < 0.7) return `rgba(30, 215, 96, 0.58)`;
  if (intensity < 0.85) return `rgba(30, 215, 96, 0.78)`;
  return `rgba(30, 215, 96, 0.95)`;
}

export default function Heatmap() {
  const data = habits.heatmap;
  const allValues = data.flat();
  const maxVal = Math.max(...allValues);

  const cellSize = 28;
  const cellGap = 3;
  const labelWidth = 48;
  const labelHeight = 28;
  const totalWidth = labelWidth + 24 * (cellSize + cellGap);
  const totalHeight = labelHeight + 7 * (cellSize + cellGap);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs uppercase tracking-wider font-semibold mb-5" style={{ color: "#8B8BA3" }}>
        Listening Heatmap — Day of Week x Hour of Day
      </h3>
      <div className="overflow-x-auto pb-2">
        <svg
          width={totalWidth}
          height={totalHeight}
          style={{ display: "block", margin: "0 auto" }}
        >
          {/* Hour labels */}
          {Array.from({ length: 24 }, (_, h) => (
            <text
              key={h}
              x={labelWidth + h * (cellSize + cellGap) + cellSize / 2}
              y={16}
              textAnchor="middle"
              fill="#8B8BA3"
              fontSize={11}
              fontFamily="Outfit"
            >
              {h % 3 === 0
                ? h === 0
                  ? "12a"
                  : h < 12
                    ? `${h}a`
                    : h === 12
                      ? "12p"
                      : `${h - 12}p`
                : ""}
            </text>
          ))}

          {/* Day labels + cells */}
          {data.map((row, dayIdx) => (
            <g key={dayIdx}>
              <text
                x={labelWidth - 8}
                y={labelHeight + dayIdx * (cellSize + cellGap) + cellSize / 2 + 5}
                textAnchor="end"
                fill="#BBBBD0"
                fontSize={12}
                fontFamily="Outfit"
                fontWeight={500}
              >
                {DAYS[dayIdx]}
              </text>
              {row.map((val, hourIdx) => (
                <g key={hourIdx}>
                  <title>{`${DAYS[dayIdx]} ${hourIdx}:00 — ${val.toLocaleString()} streams`}</title>
                  <rect
                    x={labelWidth + hourIdx * (cellSize + cellGap)}
                    y={labelHeight + dayIdx * (cellSize + cellGap)}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={getColor(val, maxVal)}
                  />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 justify-center">
        <span className="text-[11px] font-medium" style={{ color: "#8B8BA3" }}>Less</span>
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
          <div
            key={v}
            style={{
              backgroundColor: getColor(v * maxVal, maxVal),
              width: 18,
              height: 18,
              borderRadius: 4,
            }}
          />
        ))}
        <span className="text-[11px] font-medium" style={{ color: "#8B8BA3" }}>More</span>
      </div>
    </div>
  );
}
