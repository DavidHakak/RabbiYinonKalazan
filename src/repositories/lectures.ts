import "server-only";

import { and, asc, desc, eq, or, sql, type SQL } from "drizzle-orm";

import { db } from "@/db/client";
import { lectures, type ContentType, type Lecture, type NewLecture } from "@/db/schema";
import { sampleLectures } from "@/db/seed-data";
import type { Locale } from "@/i18n/config";
import type {
  FacetValue,
  LectureFacets,
  LectureQuery,
  LectureSort,
  Paged,
} from "@/lib/lectures-query";
import { localize } from "@/lib/localized";

export type {
  FacetValue,
  LectureFacets,
  LectureQuery,
  LectureSort,
  Paged,
} from "@/lib/lectures-query";

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

// ── Server-side listing: filter + sort + paginate at the database ─────────────
// The public lectures page can hold thousands of rows, so it never ships the
// whole table to the client. It asks the DB for one page at a time (plus small
// facet aggregates for the filter controls), keeping payloads tiny and fast.

const DEFAULT_PAGE_SIZE = 9;

/** Escape LIKE wildcards so a user's query is matched literally. */
function likePattern(q: string): string {
  return `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
}

/**
 * `column ->> locale` — the localized string for the active language. `locale`
 * is a fixed enum (he/en), so it is inlined as a literal rather than a bind
 * parameter: that keeps the expression byte-identical between SELECT and GROUP BY
 * (a parameter would get a different `$n` in each spot and Postgres would reject
 * the group-by).
 */
function localizedText(column: SQL | typeof lectures.topic, locale: Locale) {
  return sql<string>`(${column} ->> ${sql.raw(`'${locale}'`)})`;
}

type FacetKey = "topic" | "series" | "type";

/**
 * Build the WHERE for a query. `omit` drops one facet's own condition so faceted
 * counts reflect "every other active filter" — e.g. the series options are
 * computed with the selected topic applied, so choosing a category narrows the
 * series list to that category's sub-categories.
 */
function buildWhere(query: LectureQuery, omit?: FacetKey): SQL {
  const { locale } = query;
  const conds: SQL[] = [eq(lectures.published, true)];

  if (query.type && omit !== "type")
    conds.push(eq(lectures.contentType, query.type));
  if (query.topic && omit !== "topic")
    conds.push(sql`${localizedText(lectures.topic, locale)} = ${query.topic}`);
  if (query.series && omit !== "series")
    conds.push(sql`${localizedText(lectures.series, locale)} = ${query.series}`);

  const q = query.q?.trim();
  if (q) {
    const p = likePattern(q.toLowerCase());
    conds.push(
      or(
        sql`lower(${localizedText(lectures.title, locale)}) LIKE ${p}`,
        sql`lower(${localizedText(lectures.description, locale)}) LIKE ${p}`,
        sql`lower(${localizedText(lectures.topic, locale)}) LIKE ${p}`,
        sql`lower(${localizedText(lectures.series, locale)}) LIKE ${p}`,
      )!,
    );
  }

  return and(...conds)!;
}

function orderFor(sort: LectureSort | undefined): SQL {
  switch (sort) {
    case "oldest":
      return asc(lectures.publishedAt);
    case "longest":
      return sql`${lectures.durationMinutes} DESC NULLS LAST`;
    case "shortest":
      return sql`${lectures.durationMinutes} ASC NULLS LAST`;
    default:
      return desc(lectures.publishedAt);
  }
}

/** In-memory equivalent of the SQL listing, for the no-database demo path. */
function pageFromSeed(query: LectureQuery): Paged<Lecture> {
  const { locale } = query;
  const q = query.q?.trim().toLowerCase();
  let rows = sampleLectures.filter((l) => l.published);

  if (query.type) rows = rows.filter((l) => l.contentType === query.type);
  if (query.topic)
    rows = rows.filter((l) => localize(l.topic, locale) === query.topic);
  if (query.series)
    rows = rows.filter((l) => localize(l.series, locale) === query.series);
  if (q)
    rows = rows.filter((l) =>
      `${localize(l.title, locale)} ${localize(l.description, locale)} ${localize(l.topic, locale)} ${localize(l.series, locale)}`
        .toLowerCase()
        .includes(q),
    );

  const dur = (l: Lecture) => l.durationMinutes ?? -1;
  switch (query.sort) {
    case "oldest":
      rows.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
      break;
    case "longest":
      rows.sort((a, b) => dur(b) - dur(a));
      break;
    case "shortest":
      rows.sort((a, b) => dur(a) - dur(b));
      break;
    default:
      rows.sort(byNewest);
  }

  const total = rows.length;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  const items = rows.slice((page - 1) * pageSize, page * pageSize);
  return { items, total, page, pageSize, pageCount };
}

/** One page of published lectures matching the given filters. */
export async function getLecturesPage(query: LectureQuery): Promise<Paged<Lecture>> {
  if (!db) return pageFromSeed(query);

  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const where = buildWhere(query);

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(lectures)
    .where(where);

  const total = Number(count);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);

  const items = await db
    .select()
    .from(lectures)
    .where(where)
    .orderBy(orderFor(query.sort))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { items, total, page, pageSize, pageCount };
}

/**
 * Facet options + counts for the filter controls. Each facet is counted against
 * every *other* active filter (classic faceted search), so picking a main
 * category leaves the series dropdown showing only that category's series.
 */
export async function getLectureFacets(query: LectureQuery): Promise<LectureFacets> {
  const { locale } = query;
  if (!db) return facetsFromSeed(query);

  const [topics, series, types, totals] = await Promise.all([
    db
      .select({
        value: localizedText(lectures.topic, locale),
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(lectures)
      .where(buildWhere(query, "topic"))
      .groupBy(sql`1`),
    db
      .select({
        value: localizedText(lectures.series, locale),
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(lectures)
      .where(buildWhere(query, "series"))
      .groupBy(sql`1`),
    db
      .select({
        value: lectures.contentType,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(lectures)
      .where(buildWhere(query, "type"))
      .groupBy(lectures.contentType),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(lectures)
      .where(buildWhere(query, "topic")),
  ]);

  const clean = (rows: { value: string | null; count: number }[]): FacetValue[] =>
    rows
      .filter((r): r is { value: string; count: number } => Boolean(r.value))
      .map((r) => ({ value: r.value, count: Number(r.count) }))
      .sort((a, b) => a.value.localeCompare(b.value));

  return {
    // "All topics" count = results across every topic given the other filters.
    total: Number(totals[0]?.count ?? 0),
    topics: clean(topics),
    series: clean(series),
    types: types.map((r) => ({ value: r.value, count: Number(r.count) })),
  };
}

function facetsFromSeed(query: LectureQuery): LectureFacets {
  const { locale } = query;
  const q = query.q?.trim().toLowerCase();

  const matches = (l: Lecture, omit?: FacetKey): boolean => {
    if (!l.published) return false;
    if (query.type && omit !== "type" && l.contentType !== query.type)
      return false;
    if (query.topic && omit !== "topic" && localize(l.topic, locale) !== query.topic)
      return false;
    if (
      query.series &&
      omit !== "series" &&
      localize(l.series, locale) !== query.series
    )
      return false;
    if (
      q &&
      !`${localize(l.title, locale)} ${localize(l.description, locale)} ${localize(l.topic, locale)} ${localize(l.series, locale)}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  };

  const tally = (
    omit: FacetKey,
    get: (l: Lecture) => string,
  ): FacetValue[] => {
    const map = new Map<string, number>();
    for (const l of sampleLectures) {
      if (!matches(l, omit)) continue;
      const v = get(l);
      if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
    return Array.from(map, ([value, count]) => ({ value, count })).sort((a, b) =>
      a.value.localeCompare(b.value),
    );
  };

  const typeMap = new Map<ContentType, number>();
  for (const l of sampleLectures) {
    if (matches(l, "type")) typeMap.set(l.contentType, (typeMap.get(l.contentType) ?? 0) + 1);
  }

  return {
    total: sampleLectures.filter((l) => matches(l, "topic")).length,
    topics: tally("topic", (l) => localize(l.topic, locale)),
    series: tally("series", (l) => localize(l.series, locale)),
    types: Array.from(typeMap, ([value, count]) => ({ value, count })),
  };
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
