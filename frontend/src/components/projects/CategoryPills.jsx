const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "interior", label: "Interior" },
  { key: "exterior", label: "Exterior" },
];

export default function CategoryPills({ value = "all", onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => {
        const active = value === c.key;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange?.(c.key)}
            className={[
              "rounded-full px-3 py-1.5 text-sm transition-colors border",
              active
                ? "bg-ink text-surface border-ink"
                : "bg-transparent text-muted border-line hover:text-ink hover:bg-surface-2",
            ].join(" ")}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

