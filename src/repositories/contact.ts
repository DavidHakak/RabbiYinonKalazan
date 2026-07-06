import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { contactMessages, type ContactMessage, type NewContactMessage } from "@/db/schema";
import { sampleContactMessages } from "@/db/seed-data";

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured — admin writes require a database.");
  return db;
}

const byNewest = (a: ContactMessage, b: ContactMessage) =>
  b.createdAt.getTime() - a.createdAt.getTime();

/**
 * Persist a contact/feedback submission. When no database is connected the
 * message is logged instead of stored, so the form still works in a demo.
 */
export async function createContactMessage(
  input: Pick<
    NewContactMessage,
    "name" | "email" | "phone" | "subject" | "category" | "message"
  >,
): Promise<void> {
  if (!db) {
    console.info("[contact] message received (no DB configured):", input);
    return;
  }
  await db.insert(contactMessages).values(input);
}

// ── Admin (inbox) ─────────────────────────────────────────────────────────────

/** All submissions, newest first — for the admin inbox. */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!db) return [...sampleContactMessages].sort(byNewest);
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

/** Count of messages still awaiting a response — for the dashboard badge. */
export async function getUnhandledContactCount(): Promise<number> {
  const messages = await getContactMessages();
  return messages.filter((m) => !m.handled).length;
}

/** Toggle the "handled" flag on a message. */
export async function setContactMessageHandled(
  id: string,
  handled: boolean,
): Promise<void> {
  await requireDb().update(contactMessages).set({ handled }).where(eq(contactMessages.id, id));
}

export async function deleteContactMessage(id: string): Promise<void> {
  await requireDb().delete(contactMessages).where(eq(contactMessages.id, id));
}
