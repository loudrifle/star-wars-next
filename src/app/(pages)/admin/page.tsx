import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { ENTITY_LABELS, ENTITY_PATHS } from "@/lib/constants";
import { getAdminStats } from "@/lib/queries";

export const metadata: Metadata = { title: "Admin Dashboard" };

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="entity-card p-6 flex flex-col gap-2">
      <p
        className="text-[var(--color-sw-muted)] text-xs uppercase tracking-widest"
        style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}
      >
        {label}
      </p>
      <p
        className="text-[var(--color-sw-gold)]"
        style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "2.5rem", lineHeight: 1 }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!session?.user?.email || session.user.email !== adminEmail) {
    notFound();
  }

  const stats = await getAdminStats();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1
          className="text-[var(--color-sw-gold)]"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "3rem", letterSpacing: "0.08em" }}
        >
          Admin Dashboard
        </h1>
        <p className="text-[var(--color-sw-muted)] text-sm mt-1">Signed in as {session.user.email}</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Ratings" value={stats.totalRatings} />
        <StatCard label="Total Favorites" value={stats.totalFavorites} />
        <StatCard label="Active Users" value={stats.activeUsers} />
        <StatCard label="Registered Users" value={stats.totalUsers} />
      </div>

      {/* Top rated entities */}
      <section>
        <h2
          className="text-[var(--color-sw-gold)] mb-4"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.6rem", letterSpacing: "0.08em" }}
        >
          Top Rated Entities
        </h2>

        {stats.topEntities.length === 0 ? (
          <p className="text-[var(--color-sw-muted)]">No ratings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sw-border)] text-left">
                  <th className="pb-2 pr-4 text-[var(--color-sw-muted)] font-normal uppercase tracking-widest text-xs" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>#</th>
                  <th className="pb-2 pr-4 text-[var(--color-sw-muted)] font-normal uppercase tracking-widest text-xs" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>Name</th>
                  <th className="pb-2 pr-4 text-[var(--color-sw-muted)] font-normal uppercase tracking-widest text-xs" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>Type</th>
                  <th className="pb-2 pr-4 text-[var(--color-sw-muted)] font-normal uppercase tracking-widest text-xs text-right" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>Avg Score</th>
                  <th className="pb-2 text-[var(--color-sw-muted)] font-normal uppercase tracking-widest text-xs text-right" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>Ratings</th>
                </tr>
              </thead>
              <tbody>
                {stats.topEntities.map((entry, i) => (
                  <tr key={`${entry.entityType}-${entry.entityId}`} className="border-b border-[var(--color-sw-border)]/40 hover:bg-[var(--color-sw-card)] transition-colors">
                    <td className="py-2.5 pr-4 text-[var(--color-sw-muted)]">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <Link
                        href={`${ENTITY_PATHS[entry.entityType]}/${entry.entityId}`}
                        className="text-[var(--color-sw-text)] hover:text-[var(--color-sw-gold)] transition-colors"
                      >
                        {entry.name}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 text-[var(--color-sw-muted)]">
                      {ENTITY_LABELS[entry.entityType] ?? entry.entityType}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-[var(--color-sw-gold)] font-medium">
                      {entry.avgScore.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right text-[var(--color-sw-muted)]">
                      {entry.ratingCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
