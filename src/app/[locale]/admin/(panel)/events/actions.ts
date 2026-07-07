"use server";

import { revalidatePath } from "next/cache";

import type { NewEvent } from "@/db/schema";
import type { LocalizedText } from "@/lib/localized";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { eventSchema, type EventFormValues } from "@/lib/validation/event";
import { createEvent, deleteEvent, updateEvent } from "@/repositories/events";

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

export async function saveEvent(
  id: string | null,
  values: EventFormValues,
): Promise<SaveResult> {
  await assertAuthed();

  const parsed = eventSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
  }
  const v = parsed.data;

  const row: NewEvent = {
    slug: v.slug,
    title: cleanLocalized(v.title),
    description: cleanLocalized(v.description),
    location: cleanLocalized(v.location),
    startsAt: new Date(v.startsAt),
    endsAt: v.endsAt ? new Date(v.endsAt) : null,
    registrationUrl: v.registrationUrl?.trim() || null,
    imageUrl: v.imageUrl?.trim() || null,
    published: v.published,
  };

  try {
    if (id) await updateEvent(id, row);
    else await createEvent(row);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  revalidatePath("/[locale]/events", "page");
  revalidatePath("/[locale]/admin/events", "page");
  return { ok: true };
}

export async function deleteEventAction(id: string): Promise<SaveResult> {
  await assertAuthed();
  try {
    await deleteEvent(id);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  revalidatePath("/[locale]/events", "page");
  revalidatePath("/[locale]/admin/events", "page");
  return { ok: true };
}
