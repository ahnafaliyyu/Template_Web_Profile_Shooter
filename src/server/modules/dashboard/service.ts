import { count, eq, lt, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { guestbookEntries, profile, projects } from "../../db/schema";
import * as audit from "../audit/repo";

const STALE_DAYS = 90;

/** Semua angka dashboard dihitung di server. Bila database bermasalah, kembalikan { ok: false }. */
export async function getDashboard() {
  if (!db) return { ok: false as const, reason: "DATABASE_URL belum diatur" };
  try {
    const t0 = Date.now();
    await db.execute(sql`select 1`);
    const latencyMs = Date.now() - t0;
    const cutoff = new Date(Date.now() - STALE_DAYS * 86400_000);

    const [[pub], [draft], [pending], stale, [prof], recent] = await Promise.all([
      db.select({ n: count() }).from(projects).where(eq(projects.published, true)),
      db.select({ n: count() }).from(projects).where(eq(projects.published, false)),
      db.select({ n: count() }).from(guestbookEntries).where(eq(guestbookEntries.status, "pending")),
      db.select({ id: projects.id, slug: projects.slug, title: projects.title, updatedAt: projects.updatedAt }).from(projects).where(lt(projects.updatedAt, cutoff)).limit(5),
      db.select({ updatedAt: profile.updatedAt }).from(profile).where(eq(profile.id, 1)),
      audit.listRecent(8),
    ]);
    return {
      ok: true as const, latencyMs, published: pub.n, drafts: draft.n, pendingGuestbook: pending.n, staleDays: STALE_DAYS, stale,
      profileStale: prof ? prof.updatedAt < cutoff : false, profileMissing: !prof, recent,
    };
  } catch (e) {
    return { ok: false as const, reason: (e as Error).message };
  }
}
