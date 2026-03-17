import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-3 py-1 text-sm font-[var(--font-bebas)] tracking-wider transition-colors cursor-pointer hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)]",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--color-sw-border)] bg-[var(--color-sw-card)] text-[var(--color-sw-muted)]",
        gold: "border border-[var(--color-sw-gold-dim)] bg-[var(--color-sw-gold)]/10 text-[var(--color-sw-gold)]",
        red: "border border-[var(--color-sw-red)]/50 bg-[var(--color-sw-red)]/10 text-[var(--color-sw-red)]",
        blue: "border border-[var(--color-sw-blue)]/50 bg-[var(--color-sw-blue)]/10 text-[var(--color-sw-blue)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
