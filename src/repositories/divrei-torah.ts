import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { divreiTorah, type DvarTorah, type NewDvarTorah } from "@/db/schema";
import { sampleDivreiTorah } from "@/db/seed-data";

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured — admin writes require a database.");
  return db;
}

const byNewest = (a: DvarTorah, b: DvarTorah) =>
  b.publishedAt.getTime() - a.publishedAt.getTime();

export async function getDivreiTorah(): Promise<DvarTorah[]> {
  if (!db) return sampleDivreiTorah.filter((d) => d.published).sort(byNewest);
  return db
    .select()
    .from(divreiTorah)
    .where(eq(divreiTorah.published, true))
    .orderBy(desc(divreiTorah.publishedAt));
}

export async function getLatestDivreiTorah(limit = 3): Promise<DvarTorah[]> {
  return (await getDivreiTorah()).slice(0, limit);
}

export async function getDvarTorahBySlug(slug: string): Promise<DvarTorah | null> {
  if (!db) return sampleDivreiTorah.find((d) => d.slug === slug) ?? null;
  const rows = await db
    .select()
    .from(divreiTorah)
    .where(eq(divreiTorah.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

// ── Admin (write) ────────────────────────────────────────────────────────────

/** All divrei torah incl. unpublished, newest first — for the admin list. */
export async function getAllDivreiTorahAdmin(): Promise<DvarTorah[]> {
  if (!db) return [...sampleDivreiTorah].sort(byNewest);
  return db.select().from(divreiTorah).orderBy(desc(divreiTorah.publishedAt));
}

export async function getDvarTorahById(id: string): Promise<DvarTorah | null> {
  if (!db) return sampleDivreiTorah.find((d) => d.id === id) ?? null;
  const rows = await db.select().from(divreiTorah).where(eq(divreiTorah.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createDvarTorah(data: NewDvarTorah): Promise<DvarTorah> {
  const [row] = await requireDb().insert(divreiTorah).values(data).returning();
  return row;
}

export async function updateDvarTorah(
  id: string,
  data: Partial<NewDvarTorah>,
): Promise<DvarTorah> {
  const [row] = await requireDb()
    .update(divreiTorah)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(divreiTorah.id, id))
    .returning();
  return row;
}

export async function deleteDvarTorah(id: string): Promise<void> {
  await requireDb().delete(divreiTorah).where(eq(divreiTorah.id, id));
}
