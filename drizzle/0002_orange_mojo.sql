CREATE TYPE "public"."contact_category" AS ENUM('rabbi', 'site', 'general');--> statement-breakpoint
ALTER TABLE "contact_messages" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "category" "contact_category" DEFAULT 'general' NOT NULL;