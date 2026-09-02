import Skeleton from "@/components/ui/Skeleton";

export default function ProjectGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

