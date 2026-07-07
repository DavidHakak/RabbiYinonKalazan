import { z } from "zod";

const localized = z.record(z.string(), z.string().optional());
const isDate = (v: string) => !Number.isNaN(Date.parse(v));

/** Raw string shape the admin event form binds to. */
export interface EventFormValues {
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  location: Record<string, string>;
  startsAt: string; // datetime-local
  endsAt: string;
  registrationUrl: string;
  imageUrl: string;
  published: boolean;
}

export const eventSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slugInvalid"),
  title: localized,
  description: localized,
  location: localized,
  startsAt: z.string().min(1, "startRequired").refine(isDate, "dateInvalid"),
  endsAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || isDate(v), "dateInvalid"),
  registrationUrl: z.string().trim().url("urlInvalid").optional().or(z.literal("")),
  imageUrl: z.string().trim().url("urlInvalid").optional().or(z.literal("")),
  published: z.coerce.boolean().default(true),
});

export type EventParsed = z.infer<typeof eventSchema>;
