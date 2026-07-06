"use server";

import { createContactMessage } from "@/repositories/contact";
import { anyContainsProfanity } from "@/lib/moderation/profanity";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

export interface ContactActionResult {
  ok: boolean;
  /** i18n key under `contact.form.errors.*` when `ok` is false. */
  error?: string;
}

/** Validate, moderate and persist a contact/feedback submission. */
export async function submitContact(
  input: ContactInput,
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
  }

  const { name, email, phone, message, category } = parsed.data;

  // Re-run the profanity guard server-side — never trust the client.
  if (anyContainsProfanity(name, message)) {
    return { ok: false, error: "profanity" };
  }

  try {
    await createContactMessage({
      name,
      email: email || null,
      phone: phone || null,
      subject: null,
      category,
      message,
    });
    return { ok: true };
  } catch (error) {
    console.error("[contact] failed to store message", error);
    return { ok: false, error: "server" };
  }
}
