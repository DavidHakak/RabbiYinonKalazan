/**
 * Pluggable machine-translation layer.
 *
 * The app needs he→en for content that has no human translation (lecture titles,
 * category names). This module defines a provider-agnostic `Translator` seam so
 * the engine can be swapped without touching callers: a free provider today, an
 * AI provider (Claude/DeepL) later — just add a file and flip TRANSLATE_PROVIDER.
 *
 *   TRANSLATE_PROVIDER = "google-free" (default) | "claude" | "none"
 */

export interface TranslateOpts {
  from: string; // ISO code, e.g. "he"
  to: string; // e.g. "en"
}

export interface Translator {
  readonly name: string;
  /** Translate a batch; each result is the translation or null on failure. */
  translate(texts: string[], opts: TranslateOpts): Promise<(string | null)[]>;
}

/** No-op translator — leaves everything untranslated (safe default when off). */
class NullTranslator implements Translator {
  readonly name = "none";
  async translate(texts: string[]): Promise<(string | null)[]> {
    return texts.map(() => null);
  }
}

let cached: Translator | null = null;

/**
 * Resolve the configured translator. Providers are imported lazily so that, e.g.,
 * the Claude provider's SDK/key is only required when it is actually selected.
 */
export async function getTranslator(): Promise<Translator> {
  if (cached) return cached;
  const choice = (process.env.TRANSLATE_PROVIDER ?? "google-free").toLowerCase();
  switch (choice) {
    case "none":
      cached = new NullTranslator();
      break;
    case "claude": {
      const { ClaudeTranslator } = await import("./providers/claude");
      cached = new ClaudeTranslator();
      break;
    }
    case "google-free":
    default: {
      const { GoogleFreeTranslator } = await import("./providers/google-free");
      cached = new GoogleFreeTranslator();
      break;
    }
  }
  return cached;
}

/** Run an async mapper over `items` with bounded concurrency, preserving order. */
export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}
