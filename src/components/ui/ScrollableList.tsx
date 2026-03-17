"use client";

interface ScrollableListProps {
  title: string;
  items: { primary: string; secondary: string; detail?: string }[];
  maxHeight?: string;
}

export default function ScrollableList({ title, items, maxHeight = "300px" }: ScrollableListProps) {
  return (
    <div className="glass-card p-5">
      <h3
        className="text-xs uppercase tracking-wider font-semibold mb-4"
        style={{ color: "#4A4A62" }}
      >
        {title}
      </h3>
      <div className="overflow-y-auto space-y-1.5" style={{ maxHeight }}>
        {items.map((item, i) => (
          <div
            key={i}
            className="scrolllist-row flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent transition-all duration-200"
            style={{ backgroundColor: "rgba(5, 5, 8, 0.5)" }}
          >
            <span
              className="text-[10px] font-mono w-5 text-right shrink-0"
              style={{ color: "#4A4A62" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm truncate" style={{ color: "#EAEAEA" }}>
                {item.primary}
              </div>
              <div className="text-[11px] truncate" style={{ color: "#4A4A62" }}>
                {item.secondary}
              </div>
            </div>
            {item.detail && (
              <span className="text-[11px] shrink-0 font-mono" style={{ color: "#8B8BA3" }}>
                {item.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
