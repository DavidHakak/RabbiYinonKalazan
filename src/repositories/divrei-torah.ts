import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { divreiTorah, type DvarTorah } from "@/db/schema";
import { sampleDivreiTorah } from "@/db/seed-data";

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
