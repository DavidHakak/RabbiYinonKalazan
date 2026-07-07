import { z } from "zod";

const localized = z.record(z.string(), z.string().optional());

/** Raw string shape the admin dvar-torah form binds to. */
export interface DvarTorahFormValues {
  slug: string;
  title: Record<string, string>;
  parasha: Record<string, string>;
  excerpt: Record<string, string>;
  body: Record<string, string>;
  mediaUrl: string;
  publishedAt: string;
  featured: boolean;
  published: boolean;
}

export const dvarTorahSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slugInvalid"),
  title: localized,
  parasha: localized,
  excerpt: localized,
  body: localized,
  mediaUrl: z.string().trim().url("urlInvalid").optional().or(z.literal("")),
  publishedAt: z.string().optional(),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
});

export type DvarTorahParsed = z.infer<typeof dvarTorahSchema>;
