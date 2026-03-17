interface ScrollableListProps {
  title: string;
  items: { primary: string; secondary: string; detail?: string }[];
  maxHeight?: string;
}

export default function ScrollableList({ title, items, maxHeight = "300px" }: ScrollableListProps) {
  return (
    <div className="bg-spotify-dark-card rounded-lg p-4">
      <h3 className="text-sm text-spotify-text-secondary mb-3">{title}</h3>
      <div className="overflow-y-auto space-y-2" style={{ maxHeight }}>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center px-3 py-2 bg-spotify-dark-base rounded-md">
            <div>
              <span className="text-sm text-spotify-text-primary">{item.primary}</span>
              <span className="text-xs text-spotify-text-muted ml-2">{item.secondary}</span>
            </div>
            {item.detail && (
              <span className="text-xs text-spotify-text-muted">{item.detail}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
