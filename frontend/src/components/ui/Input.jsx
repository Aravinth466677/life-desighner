export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">
          {label}
        </span>
      )}
      <input
        className={[
          "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none",
          "focus:border-ink/30 focus:ring-4 focus:ring-[rgba(203,179,122,0.22)]",
          error ? "border-[var(--color-danger)]" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </label>
  );
}

