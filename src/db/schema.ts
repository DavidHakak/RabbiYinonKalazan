import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import type { LocalizedText } from "@/lib/localized";

/**
 * Database schema (Postgres / Supabase) via Drizzle.
 *
 * Convention: every user-facing text field is `jsonb` typed as `LocalizedText`
 * (`{ he: "…", en: "…" }`). Adding a language means writing new keys — never a
 * migration. Structural/filterable fields (slug, dates, enums) stay scalar.
 */

/** Reusable localized-text column. */
const localizedCol = (name: string) => jsonb(name).$type<LocalizedText>().notNull().default({});

export const contentTypeEnum = pgEnum("content_type", ["video", "audio", "article"]);

// ── Lectures ────────────────────────────────────────────────────────────────
export const lectures = pgTable("lectures", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: localizedCol("title"),
  description: localizedCol("description"),
  topic: localizedCol("topic"),
  series: localizedCol("series"),
  contentType: contentTypeEnum("content_type").notNull().default("video"),
  mediaUrl: text("media_url"),
  thumbnailUrl: text("thumbnail_url"),
  durationMinutes: integer("duration_minutes"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Divrei Torah (weekly Torah) ──────────────────────────────────────────────
export const divreiTorah = pgTable("divrei_torah", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: localizedCol("title"),
  parasha: localizedCol("parasha"),
  excerpt: localizedCol("excerpt"),
  body: localizedCol("body"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Events ───────────────────────────────────────────────────────────────────
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: localizedCol("title"),
  description: localizedCol("description"),
  location: localizedCol("location"),
  registrationUrl: text("registration_url"),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Editable page blocks (About, Vision, Support intro, …) ────────────────────
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  title: localizedCol("title"),
  body: localizedCol("body"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Contact form submissions ─────────────────────────────────────────────────
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Inferred row types — the single source of truth for the domain model.
export type Lecture = typeof lectures.$inferSelect;
export type NewLecture = typeof lectures.$inferInsert;
export type DvarTorah = typeof divreiTorah.$inferSelect;
export type NewDvarTorah = typeof divreiTorah.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type SiteContentBlock = typeof siteContent.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;

/** Content types available for lectures (kept in sync with the enum). */
export const contentTypes = contentTypeEnum.enumValues;
export type ContentType = (typeof contentTypes)[number];

export { sql };
