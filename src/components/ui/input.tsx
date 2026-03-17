import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded border border-[var(--color-sw-border)] bg-[var(--color-sw-card)] px-3 py-1 text-sm text-[var(--color-sw-text)] placeholder:text-[var(--color-sw-muted)] transition-colors focus:outline-none focus:border-[var(--color-sw-gold-dim)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
