import { sql } from "drizzle-orm";
import {
  boolean,
  date,
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

/** What a contact-form message is about — drives filtering in the admin inbox. */
export const contactCategoryEnum = pgEnum("contact_category", ["rabbi", "site", "general"]);

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

  // ── Source / sync fields ───────────────────────────────────────────────────
  // `sourceVideoId` is the stable external identity (YouTube id). It is what the
  // daily sync diffs against to know "what already exists here". It is NOT unique:
  // one video can appear under several categories (e.g. a lecture listed both in
  // its topical series and in a dedicated book series), one row per placement.
  // Placement identity is `slug`; re-imports upsert on that, not on the video id.
  sourceVideoId: text("source_video_id"),
  sourcePlatform: text("source_platform").notNull().default("youtube"),
  // Stable machine keys for the category / sub-category taxonomy. `topic`/`series`
  // hold the localized display text; these hold the canonical slug so grouping,
  // filtering and the sync stay stable even if display text is edited. A lecture
  // with `categorySlug = null` is "untagged" — the pending-review queue.
  categorySlug: text("category_slug"),
  subcategorySlug: text("subcategory_slug"),
  // `true` while a synced lecture awaits human categorization in the admin panel.
  needsReview: boolean("needs_review").notNull().default(false),
  // Full raw payload from the source (YouTube): stats, tags, all thumbnail sizes,
  // full description, etc. Keeps everything without a column per attribute.
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
});

// ── Divrei Torah (weekly Torah) ──────────────────────────────────────────────
// Divrei Torah are short weekly YouTube videos (one per parasha), so they carry
// the same media/source fields as lectures. `excerpt`/`body` stay for optional
// written commentary.
export const divreiTorah = pgTable("divrei_torah", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: localizedCol("title"),
  parasha: localizedCol("parasha"),
  parashaSlug: text("parasha_slug"),
  excerpt: localizedCol("excerpt"),
  body: localizedCol("body"),
  contentType: contentTypeEnum("content_type").notNull().default("video"),
  mediaUrl: text("media_url"),
  thumbnailUrl: text("thumbnail_url"),
  durationMinutes: integer("duration_minutes"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

  // ── Source / sync fields (see lectures) ────────────────────────────────────
  sourceVideoId: text("source_video_id").unique(),
  sourcePlatform: text("source_platform").notNull().default("youtube"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
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

// ── Contact / feedback submissions ───────────────────────────────────────────
// A low-friction feedback channel: warm words or criticism about the Rabbi and
// the site. Email/phone are optional — visitors may leave them for a reply.
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  subject: text("subject"),
  category: contactCategoryEnum("category").notNull().default("general"),
  message: text("message").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Users / member profiles ──────────────────────────────────────────────────
// Managed people records with role-based access. `authUserId` links a profile to
// a Supabase Auth login when the person can sign in; profiles can also exist on
// their own (a managed contact/member). Serves both Israeli (+972) and US (+1)
// audiences — phone is stored E.164, with the dialing country kept alongside.
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "user"]);
export const userStatusEnum = pgEnum("user_status", ["active", "invited", "disabled"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Supabase Auth user id — set once this person has a login. */
  authUserId: uuid("auth_user_id").unique(),
  role: userRoleEnum("role").notNull().default("user"),
  status: userStatusEnum("status").notNull().default("active"),

  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),

  /** Phone in E.164 (e.g. +972501234567 / +12125550123). */
  /** E.164 phone — optional (a self-registered user hasn't supplied one yet). */
  phone: text("phone"),
  /** Dialing country for the phone, ISO-3166 alpha-2 (IL, US, …). */
  phoneCountry: text("phone_country"),

  /** Residence country, ISO-3166 alpha-2. */
  country: text("country"),
  city: text("city"),
  addressLine: text("address_line"),
  postalCode: text("postal_code"),

  /** Preferred UI language — text (not enum) so new locales need no migration. */
  preferredLocale: text("preferred_locale").notNull().default("he"),
  birthDate: date("birth_date"),
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
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
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

/** Content types available for lectures (kept in sync with the enum). */
export const contentTypes = contentTypeEnum.enumValues;
export type ContentType = (typeof contentTypes)[number];

/** Contact/feedback categories (kept in sync with the enum). */
export const contactCategories = contactCategoryEnum.enumValues;
export type ContactCategory = (typeof contactCategories)[number];

/** User roles & statuses (kept in sync with the enums). */
export const userRoles = userRoleEnum.enumValues;
export type UserRole = (typeof userRoles)[number];
export const userStatuses = userStatusEnum.enumValues;
export type UserStatus = (typeof userStatuses)[number];

export { sql };
