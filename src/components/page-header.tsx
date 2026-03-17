interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
}

export function PageHeader({ title, subtitle, count }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-4 mb-2">
        <h1
          className="text-7xl text-[var(--color-sw-gold)]"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.1em" }}
        >
          {title}
        </h1>
        {count !== undefined && (
          <span className="text-base text-[var(--color-sw-muted)]">{count} entries</span>
        )}
      </div>
      {subtitle && (
        <p className="text-base text-[var(--color-sw-muted)]">{subtitle}</p>
      )}
      <div
        style={{
          height: "1px",
          marginTop: "0.75rem",
          background: "linear-gradient(to right, #c8a84b, transparent)",
        }}
      />
    </div>
  );
}
