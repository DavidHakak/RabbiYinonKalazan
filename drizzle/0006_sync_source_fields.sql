-- Source / sync fields for YouTube-backed content (lectures + divrei torah).
-- Written idempotently (IF NOT EXISTS / DROP..IF EXISTS) so it reconciles a DB
-- whose columns were already applied, without failing on re-run.

ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "parasha_slug" text;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "content_type" "content_type" DEFAULT 'video' NOT NULL;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "media_url" text;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "duration_minutes" integer;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "source_video_id" text;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "source_platform" text DEFAULT 'youtube' NOT NULL;--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD COLUMN IF NOT EXISTS "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "source_video_id" text;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "source_platform" text DEFAULT 'youtube' NOT NULL;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "category_slug" text;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "subcategory_slug" text;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "needs_review" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "divrei_torah" DROP CONSTRAINT IF EXISTS "divrei_torah_source_video_id_unique";--> statement-breakpoint
ALTER TABLE "divrei_torah" ADD CONSTRAINT "divrei_torah_source_video_id_unique" UNIQUE("source_video_id");--> statement-breakpoint
ALTER TABLE "lectures" DROP CONSTRAINT IF EXISTS "lectures_source_video_id_unique";--> statement-breakpoint
ALTER TABLE "lectures" ADD CONSTRAINT "lectures_source_video_id_unique" UNIQUE("source_video_id");--> statement-breakpoint
-- Re-assert RLS on every table (a prior `drizzle-kit push` had disabled it).
-- RLS on + no policies => PostgREST/anon denied; the app's owner connection
-- (Drizzle/DATABASE_URL) bypasses RLS, so nothing breaks.
ALTER TABLE "lectures" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "divrei_torah" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "site_content" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
