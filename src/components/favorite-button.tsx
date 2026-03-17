"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { toast } from "sonner";

import { toggleFavorite } from "@/actions/favorites";
import { cn } from "@/lib/utils";
import type { EntityType } from "@/types";

interface FavoriteButtonProps {
  entityType: EntityType;
  entityId: number;
  initialFavorited: boolean;
}

export function FavoriteButton({
  entityType,
  entityId,
  initialFavorited,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!session) {
      toast.error("Sign in to save favorites");
      return;
    }

    startTransition(async () => {
      try {
        const result = await toggleFavorite(entityType, entityId);
        toast.success(result.favorited ? "Added to favorites" : "Removed from favorites");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-[var(--font-bebas)] tracking-wider transition-all",
        initialFavorited
          ? "border-[var(--color-sw-red)]/60 text-[var(--color-sw-red)] bg-[var(--color-sw-red)]/10 hover:bg-[var(--color-sw-red)]/20"
          : "border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-red)]/60 hover:text-[var(--color-sw-red)]",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      title={initialFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={13}
        className={initialFavorited ? "fill-current" : ""}
      />
      {initialFavorited ? "Saved" : "Save"}
    </button>
  );
}
