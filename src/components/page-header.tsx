interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
}

export function PageHeader({ title, subtitle, count }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 mb-1">
        <h1
          className="text-5xl text-[var(--color-sw-gold)]"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.1em" }}
        >
          {title}
        </h1>
        {count !== undefined && (
          <span className="text-sm text-[var(--color-sw-muted)]">{count} entries</span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-[var(--color-sw-muted)]">{subtitle}</p>
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
