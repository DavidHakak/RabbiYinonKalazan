/**
 * Pure mappers: turn a YouTube video (+ optional scraped category info) into a
 * DB row for `lectures` or `divrei_torah`. No I/O — easy to unit-test and shared
 * by both the initial backfill and the daily cron.
 */
import type { NewDvarTorah, NewLecture } from "@/db/schema";
import type { YouTubeVideo } from "@/lib/youtube/client";
import { detectDvarTorah, type Parasha } from "@/lib/youtube/parashot";

/** Category info sourced from the old-site scrape, keyed by video id. */
export interface ScrapedInfo {
  kind: "dvar" | "lecture";
  slug?: string;
  titleHe?: string;
  titleEn?: string;
  parashaHe?: string | null;
  parashaEn?: string | null;
  parashaSlug?: string | null;
  categoryHe?: string;
  categorySlug?: string;
  subcategoryHe?: string | null;
  subcategorySlug?: string | null;
}

const YT_WATCH = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** Shared source/metadata block persisted for every synced video. */
function sourceBlock(v: YouTubeVideo) {
  return {
    sourceVideoId: v.videoId,
    sourcePlatform: "youtube" as const,
    mediaUrl: YT_WATCH(v.videoId),
    thumbnailUrl: v.thumbnailUrl,
    durationMinutes: v.durationSeconds > 0 ? v.durationMinutes : null,
    publishedAt: v.publishedAt ? new Date(v.publishedAt) : new Date(),
    contentType: "video" as const,
    metadata: {
      youtube: {
        videoId: v.videoId,
        channelId: v.channelId,
        channelTitle: v.channelTitle,
        publishedAt: v.publishedAt,
        durationSeconds: v.durationSeconds,
        durationIso: (v.raw.contentDetails as any)?.duration ?? null,
        description: v.description,
        tags: v.tags,
        categoryId: v.categoryId,
        privacyStatus: v.privacyStatus,
        thumbnails: v.thumbnails,
        stats: {
          viewCount: v.viewCount,
          likeCount: v.likeCount,
          commentCount: v.commentCount,
        },
      },
      syncedAt: new Date().toISOString(),
    } as Record<string, unknown>,
  };
}

/** A dvar-torah slug that is stable per (parasha, video). */
function dvarSlug(parashaSlug: string | null | undefined, videoId: string): string {
  return parashaSlug ? `dvar-torah-${parashaSlug}-${videoId}` : `dvar-torah-${videoId}`;
}

/** Build a `divrei_torah` insert row. */
export function buildDvarRecord(
  v: YouTubeVideo,
  info: ScrapedInfo | undefined,
  detected: { parasha: Parasha | null } | null,
): NewDvarTorah {
  const src = sourceBlock(v);
  const parashaHe = info?.parashaHe ?? detected?.parasha?.he ?? "";
  const parashaEn = info?.parashaEn ?? detected?.parasha?.en ?? "";
  const parashaSlug = info?.parashaSlug ?? detected?.parasha?.slug ?? null;
  return {
    slug: info?.slug ?? dvarSlug(parashaSlug, v.videoId),
    title: { he: info?.titleHe ?? v.title, ...(info?.titleEn ? { en: info.titleEn } : {}) },
    parasha: parashaHe ? { he: parashaHe, ...(parashaEn ? { en: parashaEn } : {}) } : {},
    parashaSlug,
    excerpt: {},
    body: {},
    featured: false,
    published: true,
    ...src,
  };
}

/** Build a `lectures` insert row. Unmapped channel videos → pending review. */
export function buildLectureRecord(v: YouTubeVideo, info: ScrapedInfo | undefined): NewLecture {
  const src = sourceBlock(v);
  const mapped = Boolean(info?.categorySlug);
  // `series` carries the sub-category, or the parasha for weekly-portion lectures.
  const seriesHe = info?.subcategoryHe ?? info?.parashaHe ?? undefined;
  return {
    slug: info?.slug ?? `lecture-${v.videoId}`,
    title: { he: info?.titleHe ?? v.title, ...(info?.titleEn ? { en: info.titleEn } : {}) },
    description: v.description ? { he: v.description } : {},
    topic: info?.categoryHe ? { he: info.categoryHe } : {},
    series: seriesHe ? { he: seriesHe } : {},
    categorySlug: info?.categorySlug ?? null,
    subcategorySlug: info?.subcategorySlug ?? info?.parashaSlug ?? null,
    // On the channel but not on the old site → needs a human to categorize.
    needsReview: !mapped,
    published: mapped, // pending items stay unpublished until tagged
    featured: false,
    sortOrder: 0,
    ...src,
  };
}

/** Decide whether a channel video is a dvar-torah or a lecture, then build its row. */
export function buildRecordForVideo(
  v: YouTubeVideo,
  info: ScrapedInfo | undefined,
): { kind: "dvar"; row: NewDvarTorah } | { kind: "lecture"; row: NewLecture } {
  const detected = detectDvarTorah(v.title);
  const isDvar = info?.kind === "dvar" || (info == null && detected != null);
  if (isDvar) return { kind: "dvar", row: buildDvarRecord(v, info, detected) };
  return { kind: "lecture", row: buildLectureRecord(v, info) };
}
