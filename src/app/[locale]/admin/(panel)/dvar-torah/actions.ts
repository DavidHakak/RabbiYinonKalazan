"use server";

import { revalidatePath } from "next/cache";

import type { NewDvarTorah } from "@/db/schema";
import type { LocalizedText } from "@/lib/localized";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  dvarTorahSchema,
  type DvarTorahFormValues,
} from "@/lib/validation/dvar-torah";
import {
  createDvarTorah,
  deleteDvarTorah,
  updateDvarTorah,
} from "@/repositories/divrei-torah";

async function assertAuthed() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

function cleanLocalized(map: Record<string, string | undefined>): LocalizedText {
  return Object.fromEntries(
    Object.entries(map).filter(([, v]) => v && v.trim().length > 0),
  );
}

export interface SaveResult {
  ok: boolean;
  error?: string;
}

export async function saveDvarTorah(
  id: string | null,
  values: DvarTorahFormValues,
): Promise<SaveResult> {
  await assertAuthed();

  const parsed = dvarTorahSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
  }
  const v = parsed.data;
  const mediaUrl = v.mediaUrl?.trim() || null;

  const row: NewDvarTorah = {
    slug: v.slug,
    title: cleanLocalized(v.title),
    parasha: cleanLocalized(v.parasha),
    excerpt: cleanLocalized(v.excerpt),
    body: cleanLocalized(v.body),
    mediaUrl,
    contentType: mediaUrl ? "video" : "article",
    featured: v.featured,
    published: v.published,
    publishedAt: v.publishedAt ? new Date(v.publishedAt) : new Date(),
  };

  try {
    if (id) await updateDvarTorah(id, row);
    else await createDvarTorah(row);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  revalidatePath("/[locale]/dvar-torah", "page");
  revalidatePath("/[locale]/dvar-torah/[slug]", "page");
  revalidatePath("/[locale]/admin/dvar-torah", "page");
  return { ok: true };
}

export async function deleteDvarTorahAction(id: string): Promise<SaveResult> {
  await assertAuthed();
  try {
    await deleteDvarTorah(id);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  revalidatePath("/[locale]/dvar-torah", "page");
  revalidatePath("/[locale]/admin/dvar-torah", "page");
  return { ok: true };
}
