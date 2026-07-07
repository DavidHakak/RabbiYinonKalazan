/**
 * DB-only repair: recompute parasha name + slug for every dvar-torah from its
 * title, using the improved matcher (strips year/author noise, prefix-matches).
 * Uses no YouTube quota. Safe to re-run.
 *
 *   npx tsx scripts/sync/fix-parashot.ts
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { db } = await import("../../src/db/client");
  const { divreiTorah } = await import("../../src/db/schema");
  const { matchParasha, detectDvarTorah } = await import("../../src/lib/youtube/parashot");
  const { eq } = await import("drizzle-orm");
  if (!db) throw new Error("DATABASE_URL not configured.");

  const rows = await db
    .select({ id: divreiTorah.id, title: divreiTorah.title, parasha: divreiTorah.parasha })
    .from(divreiTorah);

  let matched = 0;
  let unmatched = 0;
  const misses: string[] = [];

  for (const r of rows) {
    const titleHe = (r.title as { he?: string })?.he ?? "";
    const prevHe = (r.parasha as { he?: string })?.he ?? "";
    // Extract just the parasha part from the "דבר תורה ... לפרשת X" title, then
    // fall back to the previously-stored parasha text.
    const p =
      detectDvarTorah(titleHe)?.parasha ?? matchParasha(prevHe) ?? matchParasha(titleHe);
    if (p) {
      matched++;
      await db
        .update(divreiTorah)
        .set({ parasha: { he: p.he, en: p.en }, parashaSlug: p.slug, updatedAt: new Date() })
        .where(eq(divreiTorah.id, r.id));
    } else {
      unmatched++;
      if (misses.length < 20) misses.push(titleHe.slice(0, 60));
    }
  }

  console.log(`Divrei torah: ${rows.length} | matched parasha: ${matched} | unmatched: ${unmatched}`);
  if (misses.length) {
    console.log("Unmatched titles (sample):");
    for (const m of misses) console.log("  -", m);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
