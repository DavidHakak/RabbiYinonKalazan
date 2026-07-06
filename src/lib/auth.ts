import "server-only";

import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "./supabase/server";

/**
 * Emails granted admin access, from the `ADMIN_EMAILS` env var (comma-separated).
 * Lets you designate admins regardless of how their login was created.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Whether an authenticated user may enter the admin panel.
 *
 * Admins are recognized two ways (either suffices):
 *  - a trusted `app_metadata.role` of `admin`/`editor` (set by `admin:create`), or
 *  - their email is listed in `ADMIN_EMAILS`.
 *
 * Users created through the public /register flow have neither, so they are
 * regular users with NO admin access.
 */
export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  const role = (user.app_metadata as { role?: string } | undefined)?.role;
  if (role === "admin" || role === "editor") return true;
  return Boolean(user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
}

/** The current Supabase Auth user, or null. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
