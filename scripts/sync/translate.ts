/**
 * Fill missing English (`en`) translations on existing content using the
 * configured translator (default: free Google endpoint). Idempotent and cached
 * to disk, so it only translates strings it hasn't seen and is safe to re-run /
 * resume.
 *
 * Translates: lecture title/topic/series, and divrei-torah title (dvar-torah
 * titles usually already have `en` from the old-site scrape; parasha en comes
 * from the dictionary). Descriptions are skipped by default (pass --descriptions).
 *
 *   npx tsx scripts/sync/translate.ts
 *   npx tsx scripts/sync/translate.ts --descriptions
 *
 * Provider is chosen by TRANSLATE_PROVIDER (google-free | claude | none).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = resolve(HERE, ".cache");
const CACHE_FILE = resolve(CACHE_DIR, "translations.he-en.json");

type Loc = { he?: string; en?: string; [k: string]: string | undefined };
const heOf = (v: Loc) => (v?.he ?? "").trim();
const enOf = (v: Loc) => (v?.en ?? "").trim();

async function main() {
  const withDescriptions = process.argv.includes("--descriptions");
  const { db } = await import("../../src/db/client");
  const { lectures, divreiTorah } = await import("../../src/db/schema");
  const { eq } = await import("drizzle-orm");
  const { getTranslator } = await import("../../src/lib/i18n/translate");
  if (!db) throw new Error("DATABASE_URL not configured.");

  // ── load cache ──
  const cache: Record<string, string> = existsSync(CACHE_FILE)
    ? JSON.parse(readFileSync(CACHE_FILE, "utf8"))
    : {};
  const saveCache = () => {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 0));
  };

  const lecRows = await db
    .select({ id: lectures.id, title: lectures.title, topic: lectures.topic, series: lectures.series, description: lectures.description })
    .from(lectures);
  const dvarRows = await db
    .select({ id: divreiTorah.id, title: divreiTorah.title })
    .from(divreiTorah);

  // ── gather distinct he strings that still need en ──
  const need = new Set<string>();
  const wants = (v: Loc) => {
    const he = heOf(v);
    if (he && !enOf(v) && !cache[he]) need.add(he);
  };
  for (const r of lecRows) {
    wants(r.title as Loc);
    wants(r.topic as Loc);
    wants(r.series as Loc);
    if (withDescriptions) wants(r.description as Loc);
  }
  for (const r of dvarRows) wants(r.title as Loc);

  const todo = [...need];
  console.log(`Distinct strings to translate: ${todo.length} (cache has ${Object.keys(cache).length}).`);

  const translator = await getTranslator();
  console.log(`Provider: ${translator.name}`);

  // ── translate in chunks, persisting the cache as we go ──
  const CHUNK = 50;
  for (let i = 0; i < todo.length; i += CHUNK) {
    const batch = todo.slice(i, i + CHUNK);
    const res = await translator.translate(batch, { from: "he", to: "en" });
    batch.forEach((src, j) => {
      const en = res[j];
      if (en && en !== src) cache[src] = en;
    });
    saveCache();
    console.log(`  translated ${Math.min(i + CHUNK, todo.length)}/${todo.length}`);
  }
  saveCache();

  // ── apply cache back to rows ──
  const withEn = (v: Loc): Loc => {
    const he = heOf(v);
    if (!he || enOf(v) || !cache[he]) return v;
    return { ...(v as object), he, en: cache[he] };
  };

  let updatedL = 0;
  for (const r of lecRows) {
    const title = withEn(r.title as Loc);
    const topic = withEn(r.topic as Loc);
    const series = withEn(r.series as Loc);
    const description = withDescriptions ? withEn(r.description as Loc) : (r.description as Loc);
    const changed =
      title !== r.title || topic !== r.topic || series !== r.series || description !== r.description;
    if (changed) {
      await db.update(lectures).set({ title, topic, series, description, updatedAt: new Date() }).where(eq(lectures.id, r.id));
      updatedL++;
    }
  }

  let updatedD = 0;
  for (const r of dvarRows) {
    const title = withEn(r.title as Loc);
    if (title !== r.title) {
      await db.update(divreiTorah).set({ title, updatedAt: new Date() }).where(eq(divreiTorah.id, r.id));
      updatedD++;
    }
  }

  console.log(`Done. Updated ${updatedL} lectures, ${updatedD} divrei-torah. Cache size: ${Object.keys(cache).length}.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
