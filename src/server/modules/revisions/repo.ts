import { and, desc, eq } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { contentRevisions } from "../../db/schema";

export async function add(entity: string, entityId: string | number, snapshot: unknown, actor: string) {
  try {
    await requireDb().insert(contentRevisions).values({ entity, entityId: String(entityId), snapshot, actor });
  } catch (e) {
    console.error("[revisions] gagal menyimpan salinan:", (e as Error).message); // tidak boleh menggagalkan penyimpanan
  }
}

export const list = (entity: string, entityId: string | number, n = 8) =>
  requireDb().select().from(contentRevisions)
    .where(and(eq(contentRevisions.entity, entity), eq(contentRevisions.entityId, String(entityId))))
    .orderBy(desc(contentRevisions.createdAt)).limit(n);

export async function get(id: number) {
  const [r] = await requireDb().select().from(contentRevisions).where(eq(contentRevisions.id, id));
  return r ?? null;
}
