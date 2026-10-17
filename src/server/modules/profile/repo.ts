import { eq } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { profile, type L, type ProfileExtra } from "../../db/schema";

export type ProfileInput = { name: string; role: L; bio: L; availability: L | null; focus: L | null; extra: ProfileExtra };

export async function get() {
  const [r] = await requireDb().select().from(profile).where(eq(profile.id, 1));
  return r ?? null;
}

export async function save(v: ProfileInput) {
  await requireDb().insert(profile).values({ id: 1, ...v }).onConflictDoUpdate({ target: profile.id, set: { ...v, updatedAt: new Date() } });
}
