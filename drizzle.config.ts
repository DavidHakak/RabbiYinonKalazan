import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations need a direct (session-mode) connection; fall back to the app URL.
    url: (process.env.DIRECT_URL ?? process.env.DATABASE_URL)!,
  },
  verbose: true,
  strict: true,
});
