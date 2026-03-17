"use server";

import { and, avg, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { ratings } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { EntityType } from "@/types";

export async function upsertRating(
  entityType: EntityType,
  entityId: number,
  score: number,
  review?: string
) {
  if (score < 1 || score > 5) throw new Error("Score must be between 1 and 5");

  const session = await auth();
  if (!session?.user.id) throw new Error("Not authenticated");

  const userId = session.user.id;
  const now = new Date();

  const existing = await db
    .select()
    .from(ratings)
    .where(
      and(
        eq(ratings.userId, userId),
        eq(ratings.entityType, entityType),
        eq(ratings.entityId, entityId)
      )
    )
    .get();

  if (existing) {
    await db
      .update(ratings)
      .set({ score, review: review ?? existing.review, updatedAt: now })
      .where(eq(ratings.id, existing.id));
  } else {
    await db
      .insert(ratings)
      .values({ userId, entityType, entityId, score, review });
  }

  revalidatePath("/profile");
}

export async function deleteRating(
  entityType: EntityType,
  entityId: number
) {
  const session = await auth();
  if (!session?.user.id) throw new Error("Not authenticated");

  await db
    .delete(ratings)
    .where(
      and(
        eq(ratings.userId, session.user.id),
        eq(ratings.entityType, entityType),
        eq(ratings.entityId, entityId)
      )
    );

  revalidatePath("/profile");
}

export async function getEntityRatingStats(
  entityType: EntityType,
  entityId: number
) {
  const result = await db
    .select({
      avg: avg(ratings.score),
      count: count(ratings.id),
    })
    .from(ratings)
    .where(
      and(
        eq(ratings.entityType, entityType),
        eq(ratings.entityId, entityId)
      )
    )
    .get();

  return {
    average: result?.avg ? parseFloat(result.avg) : null,
    count: result?.count ?? 0,
  };
}

export async function getUserRating(
  userId: string,
  entityType: EntityType,
  entityId: number
) {
  return db
    .select()
    .from(ratings)
    .where(
      and(
        eq(ratings.userId, userId),
        eq(ratings.entityType, entityType),
        eq(ratings.entityId, entityId)
      )
    )
    .get();
}
