/**
 * DB side of the content sync: clear existing rows, and upsert lectures /
 * divrei-torah.
 *
 * Upsert policy: a conflict on the placement identity refreshes only the
 * *technical* fields pulled from YouTube (thumbnail, duration, stats/metadata).
 * It never overwrites editorial fields (title, category, topic/series,
 * needsReview, published) — so a human's categorization of a previously-pending
 * lecture survives the next daily sync.
 *
 * Lectures conflict on `slug` (not `source_video_id`) because one video can have
 * several placements — one row per category it appears in — sharing a video id
 * but differing by slug. Divrei-torah stay one-per-video, keyed on the video id.
 */
import { sql } from "drizzle-orm";

import { db as maybeDb } from "@/db/client";
import { divreiTorah, lectures, type NewDvarTorah, type NewLecture } from "@/db/schema";

function requireDb() {
  if (!maybeDb) throw new Error("DATABASE_URL is not configured — the sync requires a database.");
  return maybeDb;
}

/** Delete ALL rows from both content tables (used before a full re-import). */
export async function clearAllContent(): Promise<{ lectures: number; divrei: number }> {
  const db = requireDb();
  const delL = await db.delete(lectures).returning({ id: lectures.id });
  const delD = await db.delete(divreiTorah).returning({ id: divreiTorah.id });
  return { lectures: delL.length, divrei: delD.length };
}

/** Video ids already present in either table — for the daily "what's new" diff. */
export async function getExistingVideoIds(): Promise<Set<string>> {
  const db = requireDb();
  const [l, d] = await Promise.all([
    db.select({ id: lectures.sourceVideoId }).from(lectures),
    db.select({ id: divreiTorah.sourceVideoId }).from(divreiTorah),
  ]);
  const set = new Set<string>();
  for (const r of [...l, ...d]) if (r.id) set.add(r.id);
  return set;
}

const CHUNK = 200;
const chunk = <T>(a: T[], n: number) =>
  Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

export async function upsertLectures(rows: NewLecture[]): Promise<number> {
  if (!rows.length) return 0;
  const db = requireDb();
  let n = 0;
  for (const part of chunk(rows, CHUNK)) {
    await db
      .insert(lectures)
      .values(part)
      .onConflictDoUpdate({
        target: lectures.slug,
        set: {
          thumbnailUrl: sql`excluded.thumbnail_url`,
          durationMinutes: sql`excluded.duration_minutes`,
          mediaUrl: sql`excluded.media_url`,
          metadata: sql`excluded.metadata`,
          updatedAt: sql`now()`,
        },
      });
    n += part.length;
  }
  return n;
}

export async function upsertDivrei(rows: NewDvarTorah[]): Promise<number> {
  if (!rows.length) return 0;
  const db = requireDb();
  let n = 0;
  for (const part of chunk(rows, CHUNK)) {
    await db
      .insert(divreiTorah)
      .values(part)
      .onConflictDoUpdate({
        target: divreiTorah.sourceVideoId,
        set: {
          thumbnailUrl: sql`excluded.thumbnail_url`,
          durationMinutes: sql`excluded.duration_minutes`,
          mediaUrl: sql`excluded.media_url`,
          metadata: sql`excluded.metadata`,
          updatedAt: sql`now()`,
        },
      });
    n += part.length;
  }
  return n;
}
