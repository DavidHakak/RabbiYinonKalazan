/**
 * Minimal YouTube Data API v3 client.
 *
 * Used by the content sync to pull the Rabbi's entire channel — every video plus
 * all technical metadata (duration, description, thumbnails, tags, stats). One
 * page of uploads costs 1 quota unit; one batch of 50 video details costs 1 unit.
 * The whole channel (~2.5k videos) is well under the free 10,000 units/day.
 *
 * No SDK — plain `fetch` so it runs identically under `tsx` and in a Next.js
 * route handler on Vercel.
 */

const API = "https://www.googleapis.com/youtube/v3";

export class YouTubeError extends Error {}

function apiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new YouTubeError(
      "YOUTUBE_API_KEY is not set. Create a key at console.cloud.google.com (enable 'YouTube Data API v3') and add it to .env.",
    );
  }
  return key;
}

async function call<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: apiKey() })) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new YouTubeError(`YouTube API ${path} → ${res.status} ${res.statusText}: ${body.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

/** A single video with the technical metadata we persist. */
export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string; // ISO timestamp
  channelId: string;
  channelTitle: string;
  durationSeconds: number;
  durationMinutes: number; // rounded, for the existing `durationMinutes` column
  thumbnailUrl: string | null; // best available
  thumbnails: Record<string, { url: string; width: number; height: number }>;
  tags: string[];
  categoryId: string | null;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  privacyStatus: string | null;
  raw: Record<string, unknown>; // full snippet+contentDetails+statistics for the metadata jsonb
}

/** Resolve the channel's "uploads" playlist id from a channel id, @handle, or legacy username. */
export async function resolveUploadsPlaylist(opts: {
  channelId?: string;
  handle?: string; // e.g. "yinonkalazan" or "@yinonkalazan"
  username?: string; // legacy /user/<name>
}): Promise<{ channelId: string; uploadsPlaylistId: string; title: string }> {
  const params: Record<string, string> = { part: "contentDetails,snippet" };
  if (opts.channelId) params.id = opts.channelId;
  else if (opts.handle) params.forHandle = opts.handle.replace(/^@/, "");
  else if (opts.username) params.forUsername = opts.username;
  else throw new YouTubeError("resolveUploadsPlaylist needs channelId, handle, or username.");

  const data = await call<{
    items?: Array<{
      id: string;
      snippet: { title: string };
      contentDetails: { relatedPlaylists: { uploads: string } };
    }>;
  }>("channels", params);

  const item = data.items?.[0];
  if (!item) throw new YouTubeError(`Channel not found for ${JSON.stringify(opts)}.`);
  return {
    channelId: item.id,
    uploadsPlaylistId: item.contentDetails.relatedPlaylists.uploads,
    title: item.snippet.title,
  };
}

/** List every video id in a playlist (paginated). */
export async function listPlaylistVideoIds(playlistId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const data = await call<{
      nextPageToken?: string;
      items: Array<{ contentDetails: { videoId: string } }>;
    }>("playlistItems", {
      part: "contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    for (const it of data.items) ids.push(it.contentDetails.videoId);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return ids;
}

/** Parse an ISO-8601 duration (e.g. "PT1H2M30S") into seconds. */
export function parseIsoDuration(iso: string): number {
  const m = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  const [, d, h, min, s] = m.map((x) => (x ? Number(x) : 0));
  return d * 86400 + h * 3600 + min * 60 + s;
}

/** Fetch full details for up to 50 video ids per call. */
export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  const out: YouTubeVideo[] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const data = await call<{ items: Array<Record<string, any>> }>("videos", {
      part: "snippet,contentDetails,statistics,status",
      id: batch.join(","),
      maxResults: "50",
    });
    for (const v of data.items) {
      const sn = v.snippet ?? {};
      const cd = v.contentDetails ?? {};
      const st = v.statistics ?? {};
      const durationSeconds = parseIsoDuration(cd.duration ?? "");
      const thumbs = sn.thumbnails ?? {};
      const best =
        thumbs.maxres ?? thumbs.standard ?? thumbs.high ?? thumbs.medium ?? thumbs.default ?? null;
      out.push({
        videoId: v.id,
        title: sn.title ?? "",
        description: sn.description ?? "",
        publishedAt: sn.publishedAt ?? "",
        channelId: sn.channelId ?? "",
        channelTitle: sn.channelTitle ?? "",
        durationSeconds,
        durationMinutes: Math.max(1, Math.round(durationSeconds / 60)) || 0,
        thumbnailUrl: best?.url ?? null,
        thumbnails: thumbs,
        tags: sn.tags ?? [],
        categoryId: sn.categoryId ?? null,
        viewCount: st.viewCount != null ? Number(st.viewCount) : null,
        likeCount: st.likeCount != null ? Number(st.likeCount) : null,
        commentCount: st.commentCount != null ? Number(st.commentCount) : null,
        privacyStatus: v.status?.privacyStatus ?? null,
        raw: { snippet: sn, contentDetails: cd, statistics: st, status: v.status ?? {} },
      });
    }
  }
  return out;
}

/** Convenience: pull the whole channel (ids → details) in one call. */
export async function fetchChannelVideos(opts: {
  channelId?: string;
  handle?: string;
  username?: string;
}): Promise<{ channel: { channelId: string; title: string }; videos: YouTubeVideo[] }> {
  const { channelId, uploadsPlaylistId, title } = await resolveUploadsPlaylist(opts);
  const ids = await listPlaylistVideoIds(uploadsPlaylistId);
  const videos = await getVideoDetails(ids);
  return { channel: { channelId, title }, videos };
}
