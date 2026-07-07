/**
 * Daily content sync (Vercel Cron → this route).
 *
 * Pulls the whole YouTube channel, imports videos not yet in the DB: weekly
 * divrei-torah are auto-tagged by their title, other new videos land in the
 * lectures pending-review queue for a human to categorize. Existing rows keep
 * their editorial fields; only technical metadata is refreshed.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Set CRON_SECRET
 * in the project env; requests without it are rejected (so the endpoint can't be
 * triggered by anyone).
 */
import { NextResponse } from "next/server";

import { runDailySync } from "@/lib/sync/run";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const report = await runDailySync();
    return NextResponse.json({ ok: true, ...report });
  } catch (err) {
    console.error("[youtube-sync] failed:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
