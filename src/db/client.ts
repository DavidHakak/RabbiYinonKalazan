import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Drizzle client backed by Supabase Postgres.
 *
 * If `DATABASE_URL` is not set, `db` is `null` and the repositories transparently
 * fall back to bundled sample content — so the site renders (with demo data)
 * before the database is connected, and switches to live data the moment the
 * env var is present.
 */
const connectionString = process.env.DATABASE_URL;

// Cache the connection across hot-reloads / serverless invocations.
const globalForDb = globalThis as unknown as {
  __db?: ReturnType<typeof drizzle<typeof schema>>;
};

function createDb() {
  if (!connectionString) return null;
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

export const db =
  globalForDb.__db ?? (connectionString ? (globalForDb.__db = createDb()!) : null);

export const isDbConfigured = Boolean(connectionString);

export type Database = NonNullable<typeof db>;
export { schema };
