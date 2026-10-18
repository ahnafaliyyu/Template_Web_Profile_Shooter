import { count, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { auditLog, guestbookEntries, profile, projects } from "../../db/schema";
import * as analytics from "../analytics/repo";
import * as audit from "../audit/repo";
import * as contact from "../contact/repo";

const STALE_DAYS = 90;

/** Semua angka dashboard dihitung di server. Bila database bermasalah, kembalikan { ok: false }. */
export async function getDashboard() {
  if (!db) return { ok: false as const, reason: "DATABASE_URL belum diatur" };
  try {
    const t0 = Date.now();
    await db.execute(sql`select 1`);
    const latencyMs = Date.now() - t0;
    const cutoff = new Date(Date.now() - STALE_DAYS * 86400_000);

    const [[pub], [draft], [pending], stale, [prof], recent, visits, newMessages, [lastExport]] = await Promise.all([
      db.select({ n: count() }).from(projects).where(eq(projects.published, true)),
      db.select({ n: count() }).from(projects).where(eq(projects.published, false)),
      db.select({ n: count() }).from(guestbookEntries).where(eq(guestbookEntries.status, "pending")),
      db.select({ id: projects.id, title: projects.title, updatedAt: projects.updatedAt }).from(projects).where(lt(projects.updatedAt, cutoff)).limit(5),
      db.select({ updatedAt: profile.updatedAt }).from(profile).where(eq(profile.id, 1)),
      audit.listRecent(8),
      analytics.summary(),
      contact.countNew(),
      db.select({ at: auditLog.createdAt }).from(auditLog).where(eq(auditLog.action, "ekspor cadangan")).orderBy(desc(auditLog.createdAt)).limit(1),
    ]);
    return {
      ok: true as const, latencyMs, published: pub.n, drafts: draft.n, pendingGuestbook: pending.n, newMessages, staleDays: STALE_DAYS, stale,
      profileStale: prof ? prof.updatedAt < cutoff : false, profileMissing: !prof, recent, visits,
      lastExport: lastExport?.at ?? null,
      build: {
        env: process.env.VERCEL_ENV ?? "lokal",
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
        blob: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    };
  } catch (e) {
    return { ok: false as const, reason: (e as Error).message };
  }
}
