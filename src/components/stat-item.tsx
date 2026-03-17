import { fmt } from "@/lib/utils";

interface StatItemProps {
  label: string;
  value: string;
  raw?: boolean;
}

export function StatItem({ label, value, raw = false }: StatItemProps) {
  const display = raw ? value : fmt(value);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-[var(--font-bebas)] tracking-[0.15em] text-[var(--color-sw-muted)] uppercase">
        {label}
      </span>
      <span className="text-base text-[var(--color-sw-text)]">{display}</span>
    </div>
  );
}
