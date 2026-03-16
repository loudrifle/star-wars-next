"use client";

import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteRating, upsertRating } from "@/actions/ratings";
import { cn } from "@/lib/utils";
import type { EntityType } from "@/types";

interface RatingWidgetProps {
  entityType: EntityType;
  entityId: number;
  initialScore: number | null;
  average: number | null;
  count: number;
}

export function RatingWidget({
  entityType,
  entityId,
  initialScore,
  average,
  count,
}: RatingWidgetProps) {
  const { data: session } = useSession();
  const [hovered, setHovered] = useState(0);
  const [currentScore, setCurrentScore] = useState(initialScore);
  const [isPending, startTransition] = useTransition();

  function handleRate(score: number) {
    if (!session) {
      toast.error("Sign in to rate");
      return;
    }
    startTransition(async () => {
      try {
        if (currentScore === score) {
          await deleteRating(entityType, entityId);
          setCurrentScore(null);
          toast.success("Rating removed");
        } else {
          await upsertRating(entityType, entityId, score);
          setCurrentScore(score);
          toast.success("Rating saved");
        }
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  const displayScore = hovered || currentScore || 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Community average */}
      {count > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-sw-muted)]">
          <Star size={11} className="fill-[var(--color-sw-gold-dim)] text-[var(--color-sw-gold-dim)]" />
          <span>
            {average?.toFixed(1)} <span className="opacity-60">({count} {count === 1 ? "rating" : "ratings"})</span>
          </span>
        </div>
      )}

      {/* Interactive stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={isPending}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={cn(
              "transition-transform hover:scale-110 disabled:cursor-not-allowed",
              isPending && "opacity-50"
            )}
            title={`Rate ${star}/5`}
          >
            <Star
              size={16}
              className={cn(
                "transition-colors",
                displayScore >= star
                  ? "fill-[var(--color-sw-gold)] text-[var(--color-sw-gold)]"
                  : "fill-transparent text-[var(--color-sw-border)]"
              )}
            />
          </button>
        ))}
        {currentScore && (
          <span className="ml-1 text-[10px] text-[var(--color-sw-muted)] font-[var(--font-bebas)] tracking-wider">
            Your rating: {currentScore}/5
          </span>
        )}
      </div>
    </div>
  );
}
