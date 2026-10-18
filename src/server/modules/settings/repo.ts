import { requireDb } from "../../db/client";
import { siteSettings } from "../../db/schema";

export async function getAll(): Promise<Record<string, unknown>> {
  const rows = await requireDb().select().from(siteSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function setMany(entries: Record<string, unknown>) {
  const db = requireDb();
  for (const [key, value] of Object.entries(entries)) {
    await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
  }
}
