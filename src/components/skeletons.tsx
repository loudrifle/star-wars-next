import { Skeleton } from "@/components/ui/skeleton";

// ─── INTERNAL HELPERS ────────────────────────────────────────────────────────

/** Single stat cell: label + value */
function StatCell({ labelW = "w-14", valueW = "w-20" }: { labelW?: string; valueW?: string }) {
  return (
    <div>
      <Skeleton className={`h-2.5 ${labelW} mb-1.5`} />
      <Skeleton className={`h-4 ${valueW}`} />
    </div>
  );
}

/** Breadcrumb: "Entity / Name" */
function BreadcrumbSkeleton({ entityW = "w-20", nameW = "w-32" }: { entityW?: string; nameW?: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className={`h-4 ${entityW}`} />
      <Skeleton className="h-3 w-1.5" />
      <Skeleton className={`h-4 ${nameW}`} />
    </div>
  );
}

/** FavoriteButton + RatingWidget row */
function ActionsSkeleton({ mb = "mb-5" }: { mb?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${mb}`}>
      <Skeleton className="h-9 w-28 rounded" />
      <Skeleton className="h-9 w-44 rounded" />
    </div>
  );
}

/** Stat panel card (grid of label+value cells) */
function StatPanel({ count, cols }: { count: number; cols: "3" | "4" }) {
  const gridClass = cols === "4"
    ? "grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded"
    : "grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded";
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCell key={i} />
      ))}
    </div>
  );
}

/** Related entity card with badge list */
function RelatedSection({ wide = false }: { wide?: boolean }) {
  return (
    <div className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
      <Skeleton className="h-4 w-24 mb-3" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className={`h-6 ${wide ? "w-28" : "w-16"} rounded`} />
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-14 rounded" />
      </div>
    </div>
  );
}

// ─── LIST PAGE CARDS ─────────────────────────────────────────────────────────

/** Characters grid card: portrait + name + birth year */
export function CharacterCardSkeleton() {
  return (
    <div className="entity-card p-3 flex flex-col gap-2 h-full">
      <Skeleton className="aspect-square w-full rounded-sm" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2 mt-auto" />
    </div>
  );
}

/** Films grid card: episode label + title + director/year row */
export function FilmCardSkeleton() {
  return (
    <div className="entity-card p-7 flex flex-col gap-3 h-full">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-10 w-4/5" />
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--color-sw-border)]">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3.5 w-10 ml-auto" />
      </div>
    </div>
  );
}

/** Planet/Species grid card: name + 2×2 stat grid (no subtitle) */
export function SimpleEntityCardSkeleton() {
  return (
    <div className="entity-card p-5 flex flex-col gap-3 h-full">
      <Skeleton className="h-7 w-3/4" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCell key={i} labelW="w-12" valueW="w-16" />
        ))}
      </div>
    </div>
  );
}

/** Starship/Vehicle grid card: name + model subtitle + 2×2 stat grid */
export function EntityCardSkeleton() {
  return (
    <div className="entity-card p-5 flex flex-col gap-3 h-full">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCell key={i} labelW="w-12" valueW="w-16" />
        ))}
      </div>
    </div>
  );
}

// ─── LIST PAGE HEADER + SEARCH ────────────────────────────────────────────────

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

// ─── DETAIL PAGE SKELETONS ───────────────────────────────────────────────────

/**
 * Characters detail:
 * portrait image (left) + name, buttons, 8-stat panel (right)
 * + related sections grid below
 */
export function CharacterDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSkeleton entityW="w-24" nameW="w-36" />

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Portrait */}
        <div className="shrink-0 w-full max-w-[16rem] mx-auto md:mx-0">
          <Skeleton className="w-full rounded-lg" style={{ minHeight: "16rem", aspectRatio: "2/3" }} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <Skeleton className="h-16 w-2/3 mb-4" />
          <ActionsSkeleton />
          <StatPanel count={8} cols="3" />
        </div>
      </div>

      {/* Related sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RelatedSection />
        <RelatedSection />
        <RelatedSection />
      </div>
    </div>
  );
}

/**
 * Films detail:
 * episode label + big title + buttons + 4-stat panel
 * + opening crawl block + related entity sections
 */
export function FilmDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSkeleton entityW="w-16" nameW="w-48" />

      <div className="mb-8">
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-20 w-3/4 mb-4 leading-none" />
        <ActionsSkeleton mb="mb-6" />
        <StatPanel count={4} cols="4" />
      </div>

      {/* Opening crawl block */}
      <div className="mb-10 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
        <Skeleton className="h-3.5 w-32 mb-4" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
      </div>

      {/* Related entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RelatedSection wide />
        <RelatedSection />
        <RelatedSection />
        <RelatedSection wide />
      </div>
    </div>
  );
}

/**
 * Planets detail:
 * title + buttons + 6-stat panel (grid-cols-4) + related sections
 */
export function PlanetDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSkeleton entityW="w-16" nameW="w-32" />
      <Skeleton className="h-16 w-1/2 mb-4" />
      <ActionsSkeleton mb="mb-6" />
      <div className="mb-8">
        <StatPanel count={6} cols="4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RelatedSection wide />
        <RelatedSection />
        <RelatedSection />
      </div>
    </div>
  );
}

/**
 * Species detail:
 * title + buttons + 8-stat panel (grid-cols-3) + related sections
 */
export function SpeciesDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSkeleton entityW="w-16" nameW="w-28" />
      <Skeleton className="h-16 w-1/2 mb-4" />
      <ActionsSkeleton mb="mb-6" />
      <StatPanel count={8} cols="3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <RelatedSection wide />
        <RelatedSection />
      </div>
    </div>
  );
}

/**
 * Starships/Vehicles detail (shared):
 * title + model subtitle + buttons + stat panel + related sections
 */
export function VehicleDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSkeleton entityW="w-20" nameW="w-40" />
      <Skeleton className="h-16 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <ActionsSkeleton mb="mb-6" />
      <StatPanel count={9} cols="3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <RelatedSection />
        <RelatedSection />
      </div>
    </div>
  );
}

export function StarshipDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BreadcrumbSkeleton entityW="w-20" nameW="w-40" />
      <Skeleton className="h-16 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <ActionsSkeleton mb="mb-6" />
      <StatPanel count={11} cols="3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <RelatedSection />
        <RelatedSection />
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────

/**
 * Profile:
 * avatar + name + email + stats row
 * + favorites section + ratings section (2-col)
 */
export function ProfileSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* User info card */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-16 w-16 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="flex gap-4 mt-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Favorites */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-28" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded-lg">
              <Skeleton className="h-8 w-8 rounded shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3.5 w-10" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Ratings */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded-lg">
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-4 rounded-sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RATINGS PAGE ─────────────────────────────────────────────────────────────

/**
 * Community ratings:
 * page header + 2-col grid of 6 entity-type sections
 * each section: heading + 5 ranked items (rank + name + stars + score)
 */
export function RatingsSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-7 w-36 mb-1" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-3 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded-lg">
                <Skeleton className="h-4 w-5 shrink-0" />
                <Skeleton className="h-4 flex-1" />
                <div className="flex gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Skeleton key={k} className="h-3.5 w-3.5 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="h-4 w-8 shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────

/**
 * Admin dashboard:
 * title + subtitle + 4 stat cards + top-rated table
 */
export function AdminSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Skeleton className="h-12 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="entity-card p-6 flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-7 w-52 mb-4" />
      {/* Table header */}
      <div className="grid grid-cols-5 gap-4 px-4 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      {/* Table rows */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded-lg items-center">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-3.5 w-3.5 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

