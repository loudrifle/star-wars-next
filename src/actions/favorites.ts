"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { favorites } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { EntityType } from "@/types";

const ENTITY_PATHS: Record<string, string> = {
  character: "/characters",
  film: "/films",
  planet: "/planets",
  species: "/species",
  starship: "/starships",
  vehicle: "/vehicles",
};

export async function toggleFavorite(entityType: EntityType, entityId: number) {
  const session = await auth();
  if (!session?.user.id) throw new Error("Not authenticated");

  const userId = session.user.id;

  const existing = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.entityType, entityType),
        eq(favorites.entityId, entityId)
      )
    )
    .get();

  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    revalidatePath("/profile");
    revalidatePath(`${ENTITY_PATHS[entityType]}/${entityId}`);
    return { favorited: false };
  }

  await db.insert(favorites).values({ userId, entityType, entityId });
  revalidatePath("/profile");
  revalidatePath(`${ENTITY_PATHS[entityType]}/${entityId}`);
  return { favorited: true };
}
