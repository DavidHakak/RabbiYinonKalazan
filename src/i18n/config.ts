/**
 * Locale registry — the single place that knows which languages exist.
 *
 * To add a new language:
 *   1. Add its code to `locales`.
 *   2. Add an entry to `localeMeta` (native label + text direction).
 *   3. Create `messages/<code>.json`.
 * Everything else (routing, switcher, <html dir>) derives from here.
 */
export const locales = ["he", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "he";

export type Direction = "rtl" | "ltr";

interface LocaleMeta {
  /** Language name in the language itself, shown in the switcher. */
  nativeLabel: string;
  /** English name, for accessibility / hreflang. */
  englishLabel: string;
  dir: Direction;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  he: { nativeLabel: "עברית", englishLabel: "Hebrew", dir: "rtl" },
  en: { nativeLabel: "English", englishLabel: "English", dir: "ltr" },
};

export function getDirection(locale: Locale): Direction {
  return localeMeta[locale].dir;
}

export function isRtl(locale: Locale): boolean {
  return getDirection(locale) === "rtl";
}
