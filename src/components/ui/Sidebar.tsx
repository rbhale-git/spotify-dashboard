"use client";

import { useState, useEffect } from "react";
import { metadata } from "@/lib/data";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "habits", label: "Listening Habits" },
  { id: "deep-cuts", label: "Deep Cuts" },
  { id: "sessions", label: "Sessions" },
  { id: "recommendations", label: "Recommendations" },
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
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 flex-col bg-spotify-dark-base border-r border-spotify-dark-border p-5 z-50">
        <div className="text-spotify-green font-bold text-xs tracking-widest mb-8">
          SPOTIFY ANALYTICS
        </div>
        <nav className="flex flex-col gap-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                active === s.id
                  ? "bg-spotify-green text-black font-semibold"
                  : "text-spotify-text-secondary hover:text-spotify-text-primary hover:bg-spotify-dark-elevated"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto text-[11px] text-spotify-text-muted">
          Last updated: {lastUpdated}
        </div>
      </aside>

      <nav className="md:hidden fixed top-0 left-0 right-0 bg-spotify-dark-base border-b border-spotify-dark-border z-50 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                active === s.id
                  ? "bg-spotify-green text-black font-semibold"
                  : "text-spotify-text-secondary bg-spotify-dark-elevated"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
