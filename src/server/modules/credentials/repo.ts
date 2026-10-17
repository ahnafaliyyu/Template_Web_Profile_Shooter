import { asc, desc, eq } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { credentials, type L } from "../../db/schema";

export type CredInput = { kind: "pendidikan" | "sertifikat" | "publikasi" | "penghargaan"; title: L; issuer: string | null; year: number | null; url: string | null; published: boolean };

export const list = () => requireDb().select().from(credentials).orderBy(asc(credentials.kind), desc(credentials.year), asc(credentials.sortOrder));
export const create = (v: CredInput) => requireDb().insert(credentials).values(v);
export const remove = (id: number) => requireDb().delete(credentials).where(eq(credentials.id, id));
export const setPublished = (id: number, published: boolean) => requireDb().update(credentials).set({ published }).where(eq(credentials.id, id));
