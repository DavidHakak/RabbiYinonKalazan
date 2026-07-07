/**
 * AI translation provider (Claude) — the higher-quality option, left ready to
 * switch on later without changing any callers. Not used while TRANSLATE_PROVIDER
 * is "google-free".
 *
 * To enable: set ANTHROPIC_API_KEY and TRANSLATE_PROVIDER=claude. Uses the
 * Anthropic Messages API over fetch (no SDK dependency). Batches a whole list in
 * one call and asks for a JSON array back, which is well-suited to short titles
 * and preserves Torah terminology far better than generic MT.
 */
import type { Translator, TranslateOpts } from "../translate";

const API = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_TRANSLATE_MODEL ?? "claude-haiku-4-5-20251001";

export class ClaudeTranslator implements Translator {
  readonly name = "claude";

  async translate(texts: string[], opts: TranslateOpts): Promise<(string | null)[]> {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not set (required for TRANSLATE_PROVIDER=claude).");
    if (!texts.length) return [];

    const system =
      `You are a translator for a religious Jewish (Torah) content site. Translate each ` +
      `item from ${opts.from} to ${opts.to}. Preserve Torah terms, parasha names and proper ` +
      `nouns using their conventional English transliteration. Return ONLY a JSON array of ` +
      `strings, same length and order as the input, no commentary.`;

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: JSON.stringify(texts) }],
      }),
    });
    if (!res.ok) {
      throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const raw = data.content?.map((c) => c.text ?? "").join("") ?? "[]";
    try {
      const arr = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)) as string[];
      return texts.map((_, i) => arr[i] ?? null);
    } catch {
      return texts.map(() => null);
    }
  }
}
