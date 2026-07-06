import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { lectures, type Lecture, type NewLecture } from "@/db/schema";
import { sampleLectures } from "@/db/seed-data";

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured — admin writes require a database.");
  return db;
}

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

// ── Admin (write) ────────────────────────────────────────────────────────────

/** All lectures incl. unpublished — for the admin list. */
export async function getAllLecturesAdmin(): Promise<Lecture[]> {
  if (!db) return [...sampleLectures].sort(byNewest);
  return db.select().from(lectures).orderBy(desc(lectures.publishedAt));
}

export async function getLectureById(id: string): Promise<Lecture | null> {
  if (!db) return sampleLectures.find((l) => l.id === id) ?? null;
  const rows = await db.select().from(lectures).where(eq(lectures.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createLecture(data: NewLecture): Promise<Lecture> {
  const [row] = await requireDb().insert(lectures).values(data).returning();
  return row;
}

export async function updateLecture(
  id: string,
  data: Partial<NewLecture>,
): Promise<Lecture> {
  const [row] = await requireDb()
    .update(lectures)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(lectures.id, id))
    .returning();
  return row;
}

export async function deleteLecture(id: string): Promise<void> {
  await requireDb().delete(lectures).where(eq(lectures.id, id));
}
