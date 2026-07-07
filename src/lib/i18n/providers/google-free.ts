/**
 * Free translation provider — Google's public `translate_a/single` endpoint.
 * No API key, no cost. Unofficial and rate-limited, so we throttle, retry with
 * backoff, and translate one text per request. Good enough for bulk one-time
 * title translation; swap in an AI provider later for higher quality.
 */
import type { Translator, TranslateOpts } from "../translate";

const ENDPOINT = "https://translate.googleapis.com/translate_a/single";

async function translateOne(text: string, opts: TranslateOpts, attempt = 0): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const url = new URL(ENDPOINT);
  url.search = new URLSearchParams({
    client: "gtx",
    sl: opts.from,
    tl: opts.to,
    dt: "t",
    q: trimmed,
  }).toString();

  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
    if (!res.ok) return null;
    // Response shape: [[["translated","source",...], ...], ...]
    const data = (await res.json()) as unknown;
    const segments = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
    const joined = segments
      .map((s) => (Array.isArray(s) ? (s[0] as string) : ""))
      .join("")
      .trim();
    return joined || null;
  } catch (err) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt)); // 0.5s,1s,2s,4s
      return translateOne(text, opts, attempt + 1);
    }
    return null;
  }
}

export class GoogleFreeTranslator implements Translator {
  readonly name = "google-free";
  async translate(texts: string[], opts: TranslateOpts): Promise<(string | null)[]> {
    // Sequential with a small delay — the public endpoint blocks bursts.
    const out: (string | null)[] = [];
    for (const t of texts) {
      out.push(await translateOne(t, opts));
      await new Promise((r) => setTimeout(r, 120));
    }
    return out;
  }
}
