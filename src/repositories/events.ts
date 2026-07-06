import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { events, type Event } from "@/db/schema";
import { sampleEvents } from "@/db/seed-data";

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
