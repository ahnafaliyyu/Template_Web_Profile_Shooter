import { asc, eq } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { skills } from "../../db/schema";

export const list = () => requireDb().select().from(skills).orderBy(asc(skills.group), asc(skills.sortOrder), asc(skills.name));
export const create = (v: { name: string; group: string; level: number | null; featured: boolean }) => requireDb().insert(skills).values(v);
export const remove = (id: number) => requireDb().delete(skills).where(eq(skills.id, id));
export const setFeatured = (id: number, featured: boolean) => requireDb().update(skills).set({ featured }).where(eq(skills.id, id));
