import { PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="entity-card p-7 flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-4/5" />
            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--color-sw-border)]">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-10 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
