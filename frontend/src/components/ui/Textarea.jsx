export default function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs tracking-[0.18em] text-muted uppercase">
          {label}
        </span>
      )}
      <textarea
        className={[
          "min-h-28 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none",
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

