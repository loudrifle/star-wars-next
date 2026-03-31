import Link from "next/link";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildHref(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);
  const btnBase =
    "flex h-8 min-w-8 items-center justify-center px-2 rounded border text-xs font-[var(--font-bebas)] tracking-wider transition-all";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(searchParams, currentPage - 1)}
          className={cn(btnBase, "border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)]")}
          aria-label="Previous page"
        >
          ‹
        </Link>
      ) : (
        <span className={cn(btnBase, "border-[var(--color-sw-border)] text-[var(--color-sw-border)] cursor-not-allowed")} aria-disabled="true">
          ‹
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-8 w-8 items-center justify-center text-xs text-[var(--color-sw-muted)]"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(searchParams, page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              btnBase,
              page === currentPage
                ? "border-[var(--color-sw-gold-dim)] text-[var(--color-sw-gold)] bg-[var(--color-sw-gold)]/5"
                : "border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)]"
            )}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(searchParams, currentPage + 1)}
          className={cn(btnBase, "border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)]")}
          aria-label="Next page"
        >
          ›
        </Link>
      ) : (
        <span className={cn(btnBase, "border-[var(--color-sw-border)] text-[var(--color-sw-border)] cursor-not-allowed")} aria-disabled="true">
          ›
        </span>
      )}
    </nav>
  );
}
