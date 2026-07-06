"use server";

import { createContactMessage } from "@/repositories/contact";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

export interface ContactActionResult {
  ok: boolean;
}

/** Validate and persist a contact-form submission. */
export async function submitContact(
  input: ContactInput,
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  try {
    await createContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    return { ok: true };
  } catch (error) {
    console.error("[contact] failed to store message", error);
    return { ok: false };
  }
}
