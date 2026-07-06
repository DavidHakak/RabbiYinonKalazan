-- Custom SQL migration file, put your code below! --

-- Auto-create a public.profiles row whenever a Supabase Auth user is created
-- (via /register, admin:create, or the dashboard). Keeps the managed profiles
-- table in sync with the auth store.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    auth_user_id, email, first_name, last_name, role, status, preferred_locale
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name', ''), split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_app_meta_data->>'role', 'user')::user_role,
    'active',
    'he'
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
--> statement-breakpoint

-- Backfill: create profiles for any existing auth users that don't have one yet
-- (e.g. accounts registered before this trigger existed).
INSERT INTO public.profiles (
  auth_user_id, email, first_name, last_name, role, status, preferred_locale
)
SELECT
  u.id,
  u.email,
  COALESCE(NULLIF(u.raw_user_meta_data->>'first_name', ''), split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_app_meta_data->>'role', 'user')::user_role,
  'active',
  'he'
FROM auth.users u
LEFT JOIN public.profiles p ON p.auth_user_id = u.id
WHERE p.id IS NULL
ON CONFLICT (email) DO NOTHING;