interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
  delay?: number;
}

export default function StatCard({ value, label, color = "text-sp-green", delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass-card p-6 text-center animate-fade-in-up"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div
        className={`text-4xl font-bold tracking-tight ${color}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="text-[11px] mt-2 uppercase tracking-wider font-medium" style={{ color: "#4A4A62" }}>
        {label}
      </div>
    </div>
  );
}
