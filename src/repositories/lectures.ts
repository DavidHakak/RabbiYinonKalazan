import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { lectures, type Lecture } from "@/db/schema";
import { sampleLectures } from "@/db/seed-data";

/** Newest first — shared ordering for DB and seed paths. */
const byNewest = (a: Lecture, b: Lecture) =>
  b.publishedAt.getTime() - a.publishedAt.getTime();

export async function getLectures(): Promise<Lecture[]> {
  if (!db) return sampleLectures.filter((l) => l.published).sort(byNewest);
  return db
    .select()
    .from(lectures)
    .where(eq(lectures.published, true))
    .orderBy(desc(lectures.publishedAt));
}

export async function getLatestLectures(limit = 3): Promise<Lecture[]> {
  return (await getLectures()).slice(0, limit);
}

export async function getLectureBySlug(slug: string): Promise<Lecture | null> {
  if (!db) return sampleLectures.find((l) => l.slug === slug) ?? null;
  const rows = await db.select().from(lectures).where(eq(lectures.slug, slug)).limit(1);
  return rows[0] ?? null;
}
