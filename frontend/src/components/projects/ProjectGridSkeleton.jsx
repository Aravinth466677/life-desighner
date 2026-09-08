import Skeleton from "@/components/ui/Skeleton";

export default function ProjectGridSkeleton({ count = 6, variant = "grid" }) {
  const gridClassName = variant === "featureList"
    ? "grid grid-cols-1 gap-5"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-lg border border-line bg-surface shadow-soft"
        >
          <Skeleton className="aspect-[16/9] w-full rounded-none" />
        </div>
      ))}
    </div>
  );
}

