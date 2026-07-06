/**
 * Bootstrap an admin login (Supabase Auth user).
 *
 * The admin panel is a closed system — there is no public sign-up. Use this to
 * create the first (or any) admin account.
 *
 * Usage:
 *   npm run admin:create -- <email> <password> [firstName] [lastName]
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config({ path: ".env" });

const [, , email, password, firstName, lastName] = process.argv;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!url || !serviceKey) {
  fail(
    "Missing env. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env " +
      "(Supabase → Project Settings → API → service_role secret).",
  );
}
if (!email || !password) {
  fail("Usage: npm run admin:create -- <email> <password> [firstName] [lastName]");
}
if (password.length < 8) {
  fail("Password must be at least 8 characters.");
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

supabase.auth.admin
  .createUser({
    email,
    password,
    email_confirm: true, // no confirmation email needed
    app_metadata: { role: "admin" },
    user_metadata: {
      first_name: firstName ?? "",
      last_name: lastName ?? "",
    },
  })
  .then(({ data, error }) => {
    if (error) fail(error.message);
    console.log(`✓ Admin login created: ${data.user?.email}`);
    console.log("  Sign in at /he/admin/login");
  });
