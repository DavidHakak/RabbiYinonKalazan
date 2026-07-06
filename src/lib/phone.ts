import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

/** Every ISO-3166 alpha-2 country libphonenumber can validate. */
export const ALL_COUNTRIES = getCountries();

/** Surfaced first in country selects — the site's two main audiences. */
export const PRIMARY_COUNTRIES: CountryCode[] = ["IL", "US"];

export function isSupportedCountry(code: string): code is CountryCode {
  return (ALL_COUNTRIES as string[]).includes(code);
}

/** True only for a number that is valid for the given dialing country. */
export function isValidPhone(phone: string, country: CountryCode): boolean {
  const parsed = parsePhoneNumberFromString(phone, country);
  return Boolean(parsed?.isValid());
}

/** Normalize to E.164 (e.g. "+972501234567"), or null if invalid. */
export function toE164(phone: string, country: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(phone, country);
  return parsed?.isValid() ? parsed.number : null;
}

/** Pretty international formatting for display (e.g. "+972 50 123 4567"). */
export function formatPhone(phone: string, country?: CountryCode): string {
  const parsed = parsePhoneNumberFromString(phone, country);
  return parsed ? parsed.formatInternational() : phone;
}

/** "+972" for a dialing country — shown as a hint next to the phone input. */
export function callingCode(country: CountryCode): string {
  try {
    return `+${getCountryCallingCode(country)}`;
  } catch {
    return "";
  }
}

/** Country options ordered PRIMARY first, then the rest — for select menus. */
export function countryOptions(): CountryCode[] {
  const rest = (ALL_COUNTRIES as CountryCode[]).filter(
    (c) => !PRIMARY_COUNTRIES.includes(c),
  );
  return [...PRIMARY_COUNTRIES, ...rest];
}
