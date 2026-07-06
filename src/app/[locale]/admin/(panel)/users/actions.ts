"use server";

import { revalidatePath } from "next/cache";
import type { CountryCode } from "libphonenumber-js";

import type { NewProfile } from "@/db/schema";
import { toE164 } from "@/lib/phone";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileFormValues } from "@/lib/validation/user";
import {
  createProfile,
  getProfileByEmail,
  updateProfile,
  deleteProfile,
} from "@/repositories/profiles";

async function assertAuthed() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

export interface SaveResult {
  ok: boolean;
  /** i18n key under `admin.users.errors.*`, or a field-scoped message. */
  error?: string;
}

export async function saveProfile(
  id: string | null,
  values: ProfileFormValues,
): Promise<SaveResult> {
  await assertAuthed();

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
  }
  const v = parsed.data;

  const phoneE164 = toE164(v.phone, v.phoneCountry as CountryCode);
  if (!phoneE164) return { ok: false, error: "phoneInvalid" };

  // Enforce unique email across profiles.
  const existing = await getProfileByEmail(v.email);
  if (existing && existing.id !== id) {
    return { ok: false, error: "emailTaken" };
  }

  const row: NewProfile = {
    role: v.role,
    status: v.status,
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: phoneE164,
    phoneCountry: v.phoneCountry,
    country: v.country,
    city: v.city || null,
    addressLine: v.addressLine || null,
    postalCode: v.postalCode || null,
    preferredLocale: v.preferredLocale,
    birthDate: v.birthDate || null,
    notes: v.notes || null,
  };

  try {
    if (id) await updateProfile(id, row);
    else await createProfile(row);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  revalidatePath("/[locale]/admin/users", "page");
  return { ok: true };
}

export async function deleteProfileAction(id: string): Promise<SaveResult> {
  await assertAuthed();
  try {
    await deleteProfile(id);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  revalidatePath("/[locale]/admin/users", "page");
  return { ok: true };
}
