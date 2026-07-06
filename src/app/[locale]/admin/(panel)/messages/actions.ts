"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  deleteContactMessage,
  setContactMessageHandled,
} from "@/repositories/contact";

async function assertAuthed() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function setMessageHandledAction(
  id: string,
  handled: boolean,
): Promise<ActionResult> {
  await assertAuthed();
  try {
    await setContactMessageHandled(id, handled);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  revalidatePath("/[locale]/admin/messages", "page");
  revalidatePath("/[locale]/admin", "page");
  return { ok: true };
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  await assertAuthed();
  try {
    await deleteContactMessage(id);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
  revalidatePath("/[locale]/admin/messages", "page");
  revalidatePath("/[locale]/admin", "page");
  return { ok: true };
}
