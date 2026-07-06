import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * A translatable value stored as a `{ [locale]: string }` map (JSONB in the DB).
 * Storing translations this way means adding a new language never requires a
 * schema migration — you just start filling in the new key.
 */
export type LocalizedText = Partial<Record<Locale, string>> & { [key: string]: string | undefined };

/**
 * Resolve a localized value for the active locale, falling back to the default
 * locale and finally to any available translation, so nothing renders blank.
 */
export function localize(
  value: LocalizedText | string | null | undefined,
  locale: Locale,
): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return (
    value[locale] ??
    value[defaultLocale] ??
    Object.values(value).find((v): v is string => Boolean(v)) ??
    ""
  );
}

/** Build a `{ he, en }` map from a plain object literal (typed helper for seeds). */
export function localized(map: LocalizedText): LocalizedText {
  return map;
}
