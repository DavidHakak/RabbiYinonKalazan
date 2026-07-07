/**
 * Orchestration for the content sync, shared by the one-off backfill script and
 * the daily cron route.
 *
 *  - `buildAndUpsert` — classify a set of videos and write them.
 *  - `runDailySync`   — fetch the whole channel, keep only videos not yet in the
 *                       DB, and upsert them (dvar-torah auto-tagged by title;
 *                       lectures land in the pending-review queue).
 */
import { fetchChannelVideos, type YouTubeVideo } from "@/lib/youtube/client";
import { buildRecordForVideo, type ScrapedInfo } from "@/lib/sync/records";
import { getExistingVideoIds, upsertDivrei, upsertLectures } from "@/lib/sync/db";
import { getTranslator } from "@/lib/i18n/translate";
import type { LocalizedText } from "@/lib/localized";
import type { NewDvarTorah, NewLecture } from "@/db/schema";

/**
 * Fill missing `en` on the localized fields of freshly-built rows, using the
 * configured translator. Keeps new content bilingual with no human touch. Best
 * effort — a translation failure leaves `he` only (never blocks the sync).
 */
async function translateRows(rows: Array<{ title?: LocalizedText; description?: LocalizedText }>): Promise<void> {
  const fields: LocalizedText[] = [];
  for (const r of rows) {
    for (const f of [r.title, r.description]) {
      if (f && typeof f === "object" && f.he && !f.en) fields.push(f);
    }
  }
  if (!fields.length) return;
  try {
    const translator = await getTranslator();
    const en = await translator.translate(
      fields.map((f) => f.he as string),
      { from: "he", to: "en" },
    );
    fields.forEach((f, i) => {
      if (en[i]) f.en = en[i] as string;
    });
  } catch {
    // leave he-only; a later run or the translate script fills en
  }
}

export interface SyncReport {
  channel: string;
  fetched: number;
  newVideos: number;
  lectures: number;
  divrei: number;
  pending: number; // lectures with no category (needs human review)
}

/** Which channel to sync — from env, defaulting to the Rabbi's legacy username. */
export function channelOptsFromEnv(): { channelId?: string; handle?: string; username?: string } {
  if (process.env.YOUTUBE_CHANNEL_ID) return { channelId: process.env.YOUTUBE_CHANNEL_ID };
  if (process.env.YOUTUBE_CHANNEL_HANDLE) return { handle: process.env.YOUTUBE_CHANNEL_HANDLE };
  return { username: process.env.YOUTUBE_CHANNEL_USERNAME ?? "yinonkalazan" };
}

/** Classify `videos` against `map` (video id → scraped category placements) and
 *  upsert. A video may map to several placements (one row per category it appears
 *  in); an unmapped video yields a single pending-review lecture. */
export async function buildAndUpsert(
  videos: YouTubeVideo[],
  map: Map<string, ScrapedInfo[]>,
  opts: { translate?: boolean } = {},
): Promise<{ lectures: number; divrei: number; pending: number }> {
  const lectureRows: NewLecture[] = [];
  const dvarRows: NewDvarTorah[] = [];
  let pending = 0;

  for (const v of videos) {
    // No mapping → one pending record; otherwise one record per placement.
    const infos = map.get(v.videoId);
    const placements: Array<ScrapedInfo | undefined> = infos?.length ? infos : [undefined];
    for (const info of placements) {
      const built = buildRecordForVideo(v, info);
      if (built.kind === "dvar") dvarRows.push(built.row);
      else {
        lectureRows.push(built.row);
        if (built.row.needsReview) pending++;
      }
    }
  }

  // Auto-translate new content (daily sync). The bulk backfill translates
  // separately, with an on-disk cache, so it opts out here.
  if (opts.translate) await translateRows([...lectureRows, ...dvarRows]);

  const [lectures, divrei] = await Promise.all([
    upsertLectures(lectureRows),
    upsertDivrei(dvarRows),
  ]);
  return { lectures, divrei, pending };
}

/** Daily incremental sync: only videos not already stored. Map-free (new videos
 *  aren't on the old site), so dvar-torah are tagged by title and lectures queue
 *  for review. */
export async function runDailySync(): Promise<SyncReport> {
  const { channel, videos } = await fetchChannelVideos(channelOptsFromEnv());
  const existing = await getExistingVideoIds();
  const fresh = videos.filter((v) => !existing.has(v.videoId));
  const res = await buildAndUpsert(fresh, new Map(), { translate: true });
  return {
    channel: channel.title,
    fetched: videos.length,
    newVideos: fresh.length,
    ...res,
  };
}
