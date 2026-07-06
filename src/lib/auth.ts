import "server-only";

import type { User } from "@supabase/supabase-js";

import { getProfileByAuthUserId } from "@/repositories/profiles";

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
 * Admins are recognized three ways (any suffices):
 *  - their email is listed in `ADMIN_EMAILS` (bootstrap / override), or
 *  - a trusted `app_metadata.role` of `admin`/`editor` (set by `admin:create`), or
 *  - their managed profile role is `admin`/`editor` (set from the admin panel).
 *
 * Users created through the public /register flow default to role `user`, so
 * they have NO admin access until promoted.
 */
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  const metaRole = (user.app_metadata as { role?: string } | undefined)?.role;
  if (metaRole === "admin" || metaRole === "editor") return true;
  const profile = await getProfileByAuthUserId(user.id);
  return profile?.role === "admin" || profile?.role === "editor";
}

/** The current Supabase Auth user, or null. */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
