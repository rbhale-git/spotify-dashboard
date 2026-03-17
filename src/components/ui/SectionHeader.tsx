interface SectionHeaderProps {
  id: string;
  title: string;
  subtitle: string;
}

export default function SectionHeader({ id, title, subtitle }: SectionHeaderProps) {
  return (
    <div id={id} className="scroll-mt-20 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: "#1ED760",
            boxShadow: "0 0 10px rgba(30, 215, 96, 0.5)",
          }}
        />
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "#EAEAEA" }}
        >
          {title}
        </h2>
      </div>
      <p className="text-sm ml-5" style={{ color: "#8B8BA3" }}>
        {subtitle}
      </p>
    </div>
  );
}
