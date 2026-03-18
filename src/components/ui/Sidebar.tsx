"use client";

import { useState, useEffect } from "react";
import { metadata } from "@/lib/data";

const sections = [
  { id: "overview", label: "Overview", icon: "01" },
  { id: "habits", label: "Listening Habits", icon: "02" },
  { id: "recommendations", label: "Recommendations", icon: "03" },
  { id: "deep-cuts", label: "Deep Cuts", icon: "04" },
  { id: "sessions", label: "Sessions", icon: "05" },
  { id: "streaks", label: "Streaks", icon: "06" },
  { id: "artist-journeys", label: "Artist Journeys", icon: "07" },
  { id: "skip-autopsy", label: "Skip Autopsy", icon: "08" },
  { id: "repeat-explore", label: "Repeat vs Explore", icon: "09" },
  { id: "binge-score", label: "Binge Score", icon: "10" },
];

export default function Sidebar() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const lastUpdated = new Date(metadata.last_updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col border-r z-50"
        style={{
          backgroundColor: "rgba(5, 5, 8, 0.95)",
          borderColor: "#1e1e2e",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="p-6 pb-2">
          <div
            style={{ fontFamily: "var(--font-display)", color: "#1ED760" }}
            className="font-extrabold text-lg tracking-tight"
          >
            Spotify
          </div>
          <div
            style={{ fontFamily: "var(--font-display)", color: "#8B8BA3" }}
            className="text-xs font-medium tracking-widest uppercase mt-0.5"
          >
            Analytics
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 mt-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="group flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                backgroundColor: active === s.id ? "rgba(30, 215, 96, 0.1)" : "transparent",
                color: active === s.id ? "#1ED760" : "#8B8BA3",
              }}
            >
              <span
                className="text-[10px] font-mono font-bold w-5 text-right shrink-0"
                style={{ color: active === s.id ? "#1ED760" : "#4A4A62" }}
              >
                {s.icon}
              </span>
              <span className="font-medium">{s.label}</span>
              {active === s.id && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "#1ED760",
                    boxShadow: "0 0 8px rgba(30, 215, 96, 0.6)",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 space-y-3">
          <div
            className="h-px"
            style={{
              background: "linear-gradient(90deg, transparent, #1e1e2e, transparent)",
            }}
          />
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "#4A4A62" }}>
            Last synced
          </div>
          <div className="text-xs font-medium" style={{ color: "#8B8BA3" }}>
            {lastUpdated}
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <nav
        className="md:hidden fixed top-0 left-0 right-0 border-b z-50 px-4 py-3 overflow-x-auto"
        style={{
          backgroundColor: "rgba(5, 5, 8, 0.9)",
          borderColor: "#1e1e2e",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex gap-2 min-w-max">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 font-medium border"
              style={{
                backgroundColor: active === s.id ? "rgba(30, 215, 96, 0.15)" : "rgba(22, 22, 34, 0.5)",
                color: active === s.id ? "#1ED760" : "#8B8BA3",
                borderColor: active === s.id ? "rgba(30, 215, 96, 0.3)" : "transparent",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
