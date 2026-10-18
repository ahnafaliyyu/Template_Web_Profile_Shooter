import { and, count, desc, eq, gte } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { contactMessages } from "../../db/schema";

type Status = "baru" | "dibalas" | "arsip";

export const create = (v: { name: string; email: string; subject: string; message: string; ipHash: string }) => requireDb().insert(contactMessages).values(v);
export const listAll = () => requireDb().select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(200);
export const setStatus = (id: number, status: Status) => requireDb().update(contactMessages).set({ status }).where(eq(contactMessages.id, id));
export const remove = (id: number) => requireDb().delete(contactMessages).where(eq(contactMessages.id, id));
export async function countRecent(ipHash: string, since: Date) {
  const [r] = await requireDb().select({ n: count() }).from(contactMessages).where(and(eq(contactMessages.ipHash, ipHash), gte(contactMessages.createdAt, since)));
  return r?.n ?? 0;
}
export async function countNew() {
  const [r] = await requireDb().select({ n: count() }).from(contactMessages).where(eq(contactMessages.status, "baru"));
  return r?.n ?? 0;
}
