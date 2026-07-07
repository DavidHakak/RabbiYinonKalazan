/**
 * Overwrite lecture `topic.en` / `series.en` with the curated English from the
 * canonical taxonomy (config/taxonomy.ts), so category/sub-category labels read
 * cleanly ("Weekly Torah Portion", not machine-MT "Parsha of the week"). Title
 * translations (machine) are left untouched. DB-only, idempotent.
 *
 *   npx tsx scripts/sync/apply-taxonomy-en.ts
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

type Loc = { he?: string; en?: string; [k: string]: string | undefined };

async function main() {
  const { db } = await import("../../src/db/client");
  const { lectures } = await import("../../src/db/schema");
  const { LECTURE_TAXONOMY } = await import("../../src/config/taxonomy");
  const { eq } = await import("drizzle-orm");
  if (!db) throw new Error("DATABASE_URL not configured.");

  const catEn = new Map<string, string>();
  const subEn = new Map<string, string>();
  for (const c of LECTURE_TAXONOMY) {
    if (c.title.en) catEn.set(c.slug, c.title.en);
    for (const s of c.subcategories) if (s.title.en) subEn.set(s.slug, s.title.en);
  }

  const rows = await db
    .select({
      id: lectures.id,
      topic: lectures.topic,
      series: lectures.series,
      categorySlug: lectures.categorySlug,
      subcategorySlug: lectures.subcategorySlug,
    })
    .from(lectures);

  let updated = 0;
  for (const r of rows) {
    const topic = { ...(r.topic as Loc) };
    const series = { ...(r.series as Loc) };
    let changed = false;

    const cEn = r.categorySlug ? catEn.get(r.categorySlug) : undefined;
    if (cEn && topic.he && topic.en !== cEn) {
      topic.en = cEn;
      changed = true;
    }
    const sEn = r.subcategorySlug ? subEn.get(r.subcategorySlug) : undefined;
    if (sEn && series.he && series.en !== sEn) {
      series.en = sEn;
      changed = true;
    }

    if (changed) {
      await db.update(lectures).set({ topic, series, updatedAt: new Date() }).where(eq(lectures.id, r.id));
      updated++;
    }
  }
  console.log(`Applied curated taxonomy English to ${updated} lectures.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
