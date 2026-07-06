import type { Locale } from "@/i18n/config";

const intlLocale: Record<Locale, string> = {
  he: "he-IL",
  en: "en-US",
};

/** Locale-aware long date, e.g. "12 במאי 2025" / "May 12, 2025". */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Locale-aware date + time. */
export function formatDateTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
