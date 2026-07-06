-- Custom SQL migration file, put your code below! --

-- Enable Row Level Security on all tables.
-- With RLS on and no policies, Supabase's PostgREST API denies the anon &
-- authenticated roles any access. The app connects as the table owner via
-- DATABASE_URL (Drizzle), which bypasses RLS — so nothing breaks.
ALTER TABLE "lectures" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "divrei_torah" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;