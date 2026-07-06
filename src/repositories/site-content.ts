import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { siteContent, type SiteContentBlock } from "@/db/schema";
import { sampleSiteContent } from "@/db/seed-data";

/** Fetch an editable page block by key (e.g. "about-bio", "support-intro"). */
export async function getContentBlock(
  key: string,
): Promise<SiteContentBlock | null> {
  if (!db) return sampleSiteContent.find((c) => c.key === key) ?? null;
  const rows = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1);
  return rows[0] ?? null;
}
