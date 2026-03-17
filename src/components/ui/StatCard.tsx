interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export default function StatCard({ value, label, color = "text-spotify-green" }: StatCardProps) {
  return (
    <div className="bg-spotify-dark-card rounded-lg p-5 text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-spotify-text-muted mt-1">{label}</div>
    </div>
  );
}
