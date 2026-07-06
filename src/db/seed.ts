/**
 * Seed the database with the bundled sample content.
 * Usage: `npm run db:seed` (requires DATABASE_URL).
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  divreiTorah,
  events,
  lectures,
  siteContent,
} from "./schema";
import {
  sampleDivreiTorah,
  sampleEvents,
  sampleLectures,
  sampleSiteContent,
} from "./seed-data";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set. Add it to .env.local and retry.");
  process.exit(1);
}

/** Drop the DB-generated id so Postgres assigns a real UUID. */
const stripId = <T extends { id: string }>({ id: _id, ...rest }: T) => rest;

async function main() {
  const client = postgres(url!, { prepare: false });
  const db = drizzle(client);

  console.log("→ Seeding lectures…");
  await db
    .insert(lectures)
    .values(sampleLectures.map(stripId))
    .onConflictDoNothing({ target: lectures.slug });

  console.log("→ Seeding divrei torah…");
  await db
    .insert(divreiTorah)
    .values(sampleDivreiTorah.map(stripId))
    .onConflictDoNothing({ target: divreiTorah.slug });

  console.log("→ Seeding events…");
  await db
    .insert(events)
    .values(sampleEvents.map(stripId))
    .onConflictDoNothing({ target: events.slug });

  console.log("→ Seeding site content…");
  await db
    .insert(siteContent)
    .values(sampleSiteContent)
    .onConflictDoNothing({ target: siteContent.key });

  await client.end();
  console.log("✓ Seed complete.");
}

main().catch((error) => {
  console.error("✗ Seed failed:", error);
  process.exit(1);
});
