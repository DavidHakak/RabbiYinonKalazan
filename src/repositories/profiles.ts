import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { profiles, type NewProfile, type Profile } from "@/db/schema";

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured — user management requires a database.");
  return db;
}

export async function getProfiles(): Promise<Profile[]> {
  if (!db) return [];
  return db.select().from(profiles).orderBy(desc(profiles.createdAt));
}

export async function countProfiles(): Promise<number> {
  if (!db) return 0;
  return (await db.select({ id: profiles.id }).from(profiles)).length;
}

export async function getProfileById(id: string): Promise<Profile | null> {
  if (!db) return null;
  const rows = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  if (!db) return null;
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProfileByAuthUserId(
  authUserId: string,
): Promise<Profile | null> {
  if (!db) return null;
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.authUserId, authUserId))
    .limit(1);
  return rows[0] ?? null;
}

export async function createProfile(data: NewProfile): Promise<Profile> {
  const [row] = await requireDb().insert(profiles).values(data).returning();
  return row;
}

export async function updateProfile(
  id: string,
  data: Partial<NewProfile>,
): Promise<Profile> {
  const [row] = await requireDb()
    .update(profiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(profiles.id, id))
    .returning();
  return row;
}

export async function deleteProfile(id: string): Promise<void> {
  await requireDb().delete(profiles).where(eq(profiles.id, id));
}
