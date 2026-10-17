import { desc } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { auditLog } from "../../db/schema";

export async function log(actor: string, action: string, entity: string, entityId?: string | number) {
  try {
    await requireDb().insert(auditLog).values({ actor, action, entity, entityId: entityId?.toString() });
  } catch (e) {
    console.error("[audit] gagal mencatat:", (e as Error).message); // catatan audit tidak boleh menggagalkan aksi
  }
}

export const listRecent = (n = 8) => requireDb().select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(n);
