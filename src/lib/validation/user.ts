import { z } from "zod";

import { userRoles, userStatuses } from "@/db/schema";
import { locales } from "@/i18n/config";
import { isSupportedCountry, isValidPhone } from "@/lib/phone";
import type { CountryCode } from "libphonenumber-js";

/**
 * Hard-validated user/member profile schema, shared by the admin form and the
 * server action. Error strings are i18n keys resolved under `admin.users.errors.*`.
 *
 * Supports Israeli and US audiences (and any other country) — the phone is
 * validated against the selected dialing country via libphonenumber, and stored
 * normalized to E.164 by the action.
 */

// Letters (incl. Hebrew), marks, spaces, apostrophes and hyphens only.
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'\-\s]*$/u;

const name = z
  .string()
  .trim()
  .min(2, "nameTooShort")
  .max(60, "tooLong")
  .regex(NAME_RE, "nameInvalid");

const optionalText = (max: number, message = "tooLong") =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

const country = z
  .string()
  .trim()
  .toUpperCase()
  .refine((c) => isSupportedCountry(c), "countryInvalid");

export const profileSchema = z
  .object({
    firstName: name,
    lastName: name,
    email: z.string().trim().toLowerCase().max(160, "tooLong").email("emailInvalid"),
    phone: z.string().trim().min(3, "phoneRequired").max(30, "tooLong"),
    phoneCountry: country,
    country,
    city: optionalText(80),
    addressLine: optionalText(160),
    postalCode: z
      .string()
      .trim()
      .max(20, "tooLong")
      .regex(/^[A-Za-z0-9 \-]*$/, "postalInvalid")
      .optional()
      .or(z.literal("")),
    preferredLocale: z.enum(locales),
    role: z.enum(userRoles),
    status: z.enum(userStatuses),
    birthDate: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((v) => {
        if (!v) return true;
        const time = Date.parse(v);
        if (Number.isNaN(time)) return false;
        const d = new Date(time);
        return d < new Date() && d.getFullYear() >= 1900;
      }, "birthDateInvalid"),
    notes: optionalText(1000),
  })
  .superRefine((data, ctx) => {
    if (!isValidPhone(data.phone, data.phoneCountry as CountryCode)) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "phoneInvalid" });
    }
  });

export type ProfileParsed = z.infer<typeof profileSchema>;

/** Raw string-only shape the admin form binds to. */
export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  country: string;
  city: string;
  addressLine: string;
  postalCode: string;
  preferredLocale: string;
  role: string;
  status: string;
  birthDate: string;
  notes: string;
}
