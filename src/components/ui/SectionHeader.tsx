interface SectionHeaderProps {
  id: string;
  title: string;
  subtitle: string;
}

export default function SectionHeader({ id, title, subtitle }: SectionHeaderProps) {
  return (
    <div id={id} className="scroll-mt-20 mb-6">
      <h2 className="text-2xl font-bold text-spotify-text-primary">{title}</h2>
      <p className="text-sm text-spotify-text-muted mt-1">{subtitle}</p>
    </div>
  );
}
