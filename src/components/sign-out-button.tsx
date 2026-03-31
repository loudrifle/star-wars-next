"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  iconSize?: number;
  labelClassName?: string;
}

export function SignOutButton({ className, iconSize = 14, labelClassName }: SignOutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn("cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", className)}
      title="Sign out"
    >
      {pending ? (
        <span
          className="inline-block border-2 border-current border-t-transparent rounded-full animate-spin"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        />
      ) : (
        <LogOut size={iconSize} />
      )}
      {labelClassName !== undefined && (
        <span className={labelClassName}>{pending ? "Signing out…" : "Sign out"}</span>
      )}
    </button>
  );
}
