export default function Skeleton({ className = "" }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-[color:var(--color-line)]",
        className,
      ].join(" ")}
    />
  );
}
