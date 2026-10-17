import { and, count, desc, eq, gte } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { guestbookEntries } from "../../db/schema";

type Status = "pending" | "approved" | "hidden";

export const listApproved = (n = 50) =>
  requireDb().select().from(guestbookEntries).where(eq(guestbookEntries.status, "approved")).orderBy(desc(guestbookEntries.createdAt)).limit(n);
export const listAll = () => requireDb().select().from(guestbookEntries).orderBy(desc(guestbookEntries.createdAt)).limit(200);
export const create = (v: { name: string; message: string; ipHash: string }) => requireDb().insert(guestbookEntries).values(v);
export const setStatus = (id: number, status: Status) => requireDb().update(guestbookEntries).set({ status }).where(eq(guestbookEntries.id, id));
export const remove = (id: number) => requireDb().delete(guestbookEntries).where(eq(guestbookEntries.id, id));
export async function countRecent(ipHash: string, since: Date) {
  const [r] = await requireDb().select({ n: count() }).from(guestbookEntries).where(and(eq(guestbookEntries.ipHash, ipHash), gte(guestbookEntries.createdAt, since)));
  return r?.n ?? 0;
}
