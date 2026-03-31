import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for character list (tighter grid with image) */
export function CharacterCardSkeleton() {
  return (
    <div className="entity-card p-3 flex flex-col gap-2 h-full">
      <Skeleton className="aspect-square rounded" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2 mt-auto" />
    </div>
  );
}

/** Skeleton for generic entity cards (planets, species, starships, vehicles) */
export function EntityCardSkeleton() {
  return (
    <div className="entity-card p-5 flex flex-col gap-3 h-full">
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-auto pt-3 border-t border-[var(--color-sw-border)]">
        <div><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-4 w-16" /></div>
        <div><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-4 w-16" /></div>
        <div><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-4 w-16" /></div>
        <div><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-4 w-16" /></div>
      </div>
    </div>
  );
}

/** Skeleton for species/planet cards (no bottom section) */
export function SimpleEntityCardSkeleton() {
  return (
    <div className="entity-card p-5 flex flex-col gap-3 h-full">
      <Skeleton className="h-7 w-3/4" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
        <div><Skeleton className="h-3 w-14 mb-1" /><Skeleton className="h-4 w-20" /></div>
        <div><Skeleton className="h-3 w-14 mb-1" /><Skeleton className="h-4 w-20" /></div>
        <div><Skeleton className="h-3 w-14 mb-1" /><Skeleton className="h-4 w-20" /></div>
        <div><Skeleton className="h-3 w-14 mb-1" /><Skeleton className="h-4 w-20" /></div>
      </div>
    </div>
  );
}

/** Shared list page header skeleton */
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

/** Skeleton for a detail page */
export function DetailPageSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Skeleton className="aspect-square w-full max-w-xs rounded-lg" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Skeleton className="h-12 w-2/3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
