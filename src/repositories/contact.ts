import "server-only";

import { db } from "@/db/client";
import { contactMessages, type NewContactMessage } from "@/db/schema";

/**
 * Persist a contact-form submission. When no database is connected the message
 * is logged instead of stored, so the form still works in a demo environment.
 */
export async function createContactMessage(
  input: Pick<NewContactMessage, "name" | "email" | "phone" | "subject" | "message">,
): Promise<void> {
  if (!db) {
    console.info("[contact] message received (no DB configured):", input);
    return;
  }
  await db.insert(contactMessages).values(input);
}
