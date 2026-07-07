/**
 * One-off backfill: import the Rabbi's entire YouTube channel into the DB,
 * overlaying the category division scraped from the old site.
 *
 *   Technical data (duration, description, thumbnails, tags, stats)  ← YouTube
 *   Category / sub-category / parasha division                      ← old site
 *
 * A channel video that matches the scrape is fully tagged; one that isn't on the
 * old site is imported as a pending-review lecture (or auto-tagged dvar-torah if
 * its title says so).
 *
 * Usage:
 *   npx tsx scripts/sync/backfill.ts            # import/refresh (keeps existing)
 *   npx tsx scripts/sync/backfill.ts --clear    # delete all content first
 *   npx tsx scripts/sync/backfill.ts --dry-run  # fetch + classify, no writes
 *
 * Requires YOUTUBE_API_KEY and DATABASE_URL in .env.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { config } from "dotenv";

// Type-only import (erased at build → does not read env at load time).
import type { ScrapedInfo } from "../../src/lib/sync/records";

config({ path: ".env.local" });
config({ path: ".env" });

const HERE = dirname(fileURLToPath(import.meta.url));
const SEED = resolve(HERE, "../../src/data/seed");

async function main() {
  const args = new Set(process.argv.slice(2));
  const doClear = args.has("--clear");
  const dryRun = args.has("--dry-run");

  // Imported lazily so `config()` runs before any module reads env (the db
  // client and YouTube client both read process.env at first use).
  const { fetchChannelVideos } = await import("../../src/lib/youtube/client");
  const { findParashaHe } = await import("../../src/lib/youtube/parashot");
  const { buildAndUpsert, channelOptsFromEnv } = await import("../../src/lib/sync/run");
  const { clearAllContent } = await import("../../src/lib/sync/db");

  // ── Build the video-id → scraped-category map ────────────────────────────
  const lectures = JSON.parse(readFileSync(resolve(SEED, "lectures.json"), "utf8")) as any[];
  const divrei = JSON.parse(readFileSync(resolve(SEED, "dvar-torah.json"), "utf8")) as any[];
  // A video id maps to one or more placements. A dvar-torah mapping is exclusive
  // (a video is either a dvar-torah or a lecture); a lecture may have several
  // placements — one per category it is listed under (e.g. a topical series and a
  // book series) — each a distinct row, deduped by its own slug.
  const map = new Map<string, ScrapedInfo[]>();

  for (const d of divrei) {
    if (!d.sourceVideoId) continue;
    const p = findParashaHe(d.parasha?.he ?? "");
    map.set(d.sourceVideoId, [{
      kind: "dvar",
      slug: d.slug,
      titleHe: d.title?.he,
      titleEn: d.title?.en,
      parashaHe: d.parasha?.he ?? null,
      parashaEn: d.parasha?.en ?? p?.en ?? null,
      parashaSlug: p?.slug ?? null,
    }]);
  }
  for (const l of lectures) {
    if (!l.sourceVideoId) continue;
    const existing = map.get(l.sourceVideoId);
    if (existing?.some((i) => i.kind === "dvar")) continue; // a dvar-torah mapping wins
    if (existing?.some((i) => i.slug === l.slug)) continue; // same placement already added
    const info: ScrapedInfo = {
      kind: "lecture",
      slug: l.slug,
      titleHe: l.title?.he,
      categoryHe: l.category?.he,
      categorySlug: l.categorySlug,
      subcategoryHe: l.subcategory?.he ?? null,
      subcategorySlug: l.subcategorySlug ?? null,
      parashaHe: l.parasha?.he ?? null,
      parashaSlug: l.parashaSlug ?? null,
    };
    if (existing) existing.push(info);
    else map.set(l.sourceVideoId, [info]);
  }
  const placements = [...map.values()].reduce((n, arr) => n + arr.length, 0);
  console.log(`Scraped category map: ${map.size} videos, ${placements} placements (${divrei.length} dvar-torah, ${lectures.length} lecture rows).`);

  // ── Pull the whole channel from YouTube ──────────────────────────────────
  console.log("Fetching channel from YouTube…");
  const { channel, videos } = await fetchChannelVideos(channelOptsFromEnv());
  console.log(`Channel "${channel.title}" (${channel.channelId}) → ${videos.length} videos.`);

  const channelIds = new Set(videos.map((v) => v.videoId));
  const mappedOnChannel = [...map.keys()].filter((id) => channelIds.has(id)).length;
  const unmappedOnChannel = videos.filter((v) => !map.has(v.videoId)).length;
  const scrapedNotOnChannel = [...map.keys()].filter((id) => !channelIds.has(id));
  console.log(
    `Match: ${mappedOnChannel} channel videos categorized from the old site; ` +
      `${unmappedOnChannel} on the channel but not on the old site (→ dvar-torah by title, else pending). ` +
      `${scrapedNotOnChannel.length} old-site videos are no longer on the channel (skipped).`,
  );

  if (dryRun) {
    console.log("Dry run — no writes.");
    return;
  }

  if (doClear) {
    const cleared = await clearAllContent();
    console.log(`Cleared existing content: ${cleared.lectures} lectures, ${cleared.divrei} divrei-torah.`);
  }

  console.log("Upserting…");
  const res = await buildAndUpsert(videos, map);
  console.log(
    `Done. Lectures: ${res.lectures} (of which ${res.pending} pending review). Divrei-torah: ${res.divrei}.`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
