import { z } from "zod";

import { contentTypes } from "@/db/schema";
import type { Locale } from "@/i18n/config";

/** A `{ locale: value }` map for the form (all languages optional at the field level). */
export type LocalizedFormValue = Record<Locale, string>;

/** Shape the admin lecture form binds to (all raw/string values). */
export interface LectureFormValues {
  slug: string;
  title: LocalizedFormValue;
  description: LocalizedFormValue;
  topic: LocalizedFormValue;
  series: LocalizedFormValue;
  contentType: (typeof contentTypes)[number];
  mediaUrl: string;
  durationMinutes: string;
  featured: boolean;
  published: boolean;
  sortOrder: string;
  publishedAt: string; // yyyy-mm-dd
}

const localized = z.record(z.string(), z.string().optional());

/** Server-side schema: validates + coerces the raw form payload. */
export const lectureSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug: lowercase letters, numbers and dashes only"),
  title: localized,
  description: localized,
  topic: localized,
  series: localized,
  contentType: z.enum(contentTypes),
  mediaUrl: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().positive().optional().nullable(),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  publishedAt: z.string().optional(),
});

export type LectureParsed = z.infer<typeof lectureSchema>;
