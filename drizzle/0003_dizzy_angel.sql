CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'invited', 'disabled');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"phone_country" text NOT NULL,
	"country" text NOT NULL,
	"city" text,
	"address_line" text,
	"postal_code" text,
	"preferred_locale" text DEFAULT 'he' NOT NULL,
	"birth_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_auth_user_id_unique" UNIQUE("auth_user_id"),
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
-- Enable RLS: profiles hold PII. Deny PostgREST/anon; the app reaches this table
-- only via the owner connection (Drizzle/DATABASE_URL), which bypasses RLS.
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
