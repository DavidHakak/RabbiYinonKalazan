import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { events, type Event, type NewEvent } from "@/db/schema";
import { sampleEvents } from "@/db/seed-data";

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured — admin writes require a database.");
  return db;
}

const bySoonest = (a: Event, b: Event) => a.startsAt.getTime() - b.startsAt.getTime();

async function getAllEvents(): Promise<Event[]> {
  if (!db) return sampleEvents.filter((e) => e.published).sort(bySoonest);
  return db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(asc(events.startsAt));
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const now = Date.now();
  return (await getAllEvents())
    .filter((e) => e.startsAt.getTime() >= now)
    .sort(bySoonest);
}

export async function getPastEvents(): Promise<Event[]> {
  const now = Date.now();
  return (await getAllEvents())
    .filter((e) => e.startsAt.getTime() < now)
    .sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!db) return sampleEvents.find((e) => e.slug === slug) ?? null;
  const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return rows[0] ?? null;
}

// ── Admin (write) ────────────────────────────────────────────────────────────

/** All events incl. unpublished, newest start first — for the admin list. */
export async function getAllEventsAdmin(): Promise<Event[]> {
  if (!db) return [...sampleEvents].sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  return db.select().from(events).orderBy(desc(events.startsAt));
}

export async function getEventById(id: string): Promise<Event | null> {
  if (!db) return sampleEvents.find((e) => e.id === id) ?? null;
  const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createEvent(data: NewEvent): Promise<Event> {
  const [row] = await requireDb().insert(events).values(data).returning();
  return row;
}

export async function updateEvent(id: string, data: Partial<NewEvent>): Promise<Event> {
  const [row] = await requireDb()
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();
  return row;
}

export async function deleteEvent(id: string): Promise<void> {
  await requireDb().delete(events).where(eq(events.id, id));
}
