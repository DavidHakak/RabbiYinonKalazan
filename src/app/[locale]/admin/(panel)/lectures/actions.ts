"use server";

import { revalidatePath } from "next/cache";

import type { NewLecture } from "@/db/schema";
import type { LocalizedText } from "@/lib/localized";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  lectureSchema,
  type LectureFormValues,
} from "@/lib/validation/lecture";
import {
  createLecture,
  deleteLecture,
  updateLecture,
} from "@/repositories/lectures";

async function assertAuthed() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

/** Drop empty translations so we never persist `""`. */
function cleanLocalized(map: Record<string, string | undefined>): LocalizedText {
  return Object.fromEntries(
    Object.entries(map).filter(([, v]) => v && v.trim().length > 0),
  );
}

export interface SaveResult {
  ok: boolean;
  error?: string;
}

export async function saveLecture(
  id: string | null,
  values: LectureFormValues,
): Promise<SaveResult> {
  await assertAuthed();

  const parsed = lectureSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const v = parsed.data;

  const row: NewLecture = {
    slug: v.slug,
    title: cleanLocalized(v.title),
    description: cleanLocalized(v.description),
    topic: cleanLocalized(v.topic),
    series: cleanLocalized(v.series),
    contentType: v.contentType,
    mediaUrl: v.mediaUrl?.trim() || null,
    durationMinutes: v.durationMinutes ?? null,
    featured: v.featured,
    published: v.published,
    sortOrder: v.sortOrder,
    publishedAt: v.publishedAt ? new Date(v.publishedAt) : new Date(),
  };

  try {
    if (id) await updateLecture(id, row);
    else await createLecture(row);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  revalidatePath("/[locale]/lectures", "page");
  revalidatePath("/[locale]/lectures/[slug]", "page");
  revalidatePath("/[locale]/admin/lectures", "page");
  return { ok: true };
}

export async function deleteLectureAction(id: string): Promise<SaveResult> {
  await assertAuthed();
  try {
    await deleteLecture(id);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  revalidatePath("/[locale]/lectures", "page");
  revalidatePath("/[locale]/admin/lectures", "page");
  return { ok: true };
}
