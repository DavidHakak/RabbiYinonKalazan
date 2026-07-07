import "server-only";

import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/localized";
import { getDivreiTorah } from "@/repositories/divrei-torah";
import { getPastEvents, getUpcomingEvents } from "@/repositories/events";
import { getLectures } from "@/repositories/lectures";

export type SearchResultType = "lecture" | "dvarTorah" | "event";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  excerpt: string;
  /** Locale-agnostic internal path — the client renders it with a locale <Link>. */
  href: string;
  /** Short contextual label (topic / parasha / date). */
  badge: string;
}

interface Candidate extends SearchResult {
  haystack: string;
  titleText: string;
  recencyKey: string;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[֑-ׇ]/g, "") // strip Hebrew niqqud/te'amim so "שָׁלוֹם" matches "שלום"
    .replace(/["'׳״]/g, "")
    .trim();
}

/**
 * Unified full-site search across lectures, weekly Torah and events. Runs on the
 * server (so it sees real DB content when configured, demo data otherwise) and
 * returns already-localized, link-ready results ranked by relevance.
 */
export async function searchContent(
  rawQuery: string,
  locale: Locale,
  limit = 8,
): Promise<SearchResult[]> {
  const q = normalize(rawQuery);
  if (q.length < 2) return [];

  const [lectures, divrei, upcoming, past] = await Promise.all([
    getLectures(),
    getDivreiTorah(),
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const candidates: Candidate[] = [];

  for (const l of lectures) {
    const title = localize(l.title, locale);
    const topic = localize(l.topic, locale);
    const excerpt = localize(l.description, locale);
    candidates.push({
      id: `lecture-${l.id}`,
      type: "lecture",
      title,
      excerpt,
      href: `/lectures/${l.slug}`,
      badge: topic,
      titleText: normalize(title),
      haystack: normalize(
        `${title} ${excerpt} ${topic} ${localize(l.series, locale)}`,
      ),
      recencyKey: l.publishedAt.toISOString(),
    });
  }

  for (const d of divrei) {
    const title = localize(d.title, locale);
    const parasha = localize(d.parasha, locale);
    const excerpt = localize(d.excerpt, locale);
    candidates.push({
      id: `dvar-${d.id}`,
      type: "dvarTorah",
      title,
      excerpt,
      href: `/dvar-torah/${d.slug}`,
      badge: parasha,
      titleText: normalize(title),
      haystack: normalize(
        `${title} ${excerpt} ${parasha} ${localize(d.body, locale)}`,
      ),
      recencyKey: d.publishedAt.toISOString(),
    });
  }

  for (const e of [...upcoming, ...past]) {
    const title = localize(e.title, locale);
    const excerpt = localize(e.description, locale);
    candidates.push({
      id: `event-${e.id}`,
      type: "event",
      title,
      excerpt,
      href: "/events",
      badge: formatDate(e.startsAt, locale),
      titleText: normalize(title),
      haystack: normalize(
        `${title} ${excerpt} ${localize(e.location, locale)}`,
      ),
      recencyKey: e.startsAt.toISOString(),
    });
  }

  const matched = candidates
    .map((c) => {
      if (!c.haystack.includes(q)) return null;
      // Title hits rank above body-only hits; whole-word/prefix hits rank higher.
      let score = c.titleText.includes(q) ? 0 : 2;
      if (c.titleText.startsWith(q)) score -= 1;
      return { c, score };
    })
    .filter((m): m is { c: Candidate; score: number } => m !== null)
    .sort(
      (a, b) =>
        a.score - b.score || b.c.recencyKey.localeCompare(a.c.recencyKey),
    )
    .slice(0, limit);

  return matched.map(({ c }) => ({
    id: c.id,
    type: c.type,
    title: c.title,
    excerpt: c.excerpt,
    href: c.href,
    badge: c.badge,
  }));
}
