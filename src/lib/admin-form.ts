import { locales, type Locale } from "@/i18n/config";

import type { LocalizedText } from "./localized";

/** Fill every locale key so react-hook-form has controlled string defaults. */
export function toLocalizedForm(
  value: LocalizedText | undefined | null,
): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((l) => [l, value?.[l] ?? ""]),
  ) as Record<Locale, string>;
}

/** Date → `yyyy-mm-dd` for <input type="date">. */
export function toDateInput(date?: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

/** Date → `yyyy-mm-ddThh:mm` (local) for <input type="datetime-local">. */
export function toDateTimeLocal(date?: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
