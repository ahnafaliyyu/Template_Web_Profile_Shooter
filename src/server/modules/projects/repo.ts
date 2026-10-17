import { asc, eq } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { projects, projectTechnologies, technologies, type L } from "../../db/schema";
import type { ProjectRecord } from "./types";

/** Satu-satunya tempat yang menyentuh tabel proyek. */
export type AdminProject = ProjectRecord & { id: number; published: boolean; sortOrder: number; updatedAt: Date };
export type ProjectInput = Omit<ProjectRecord, "stack" | "note"> & { note: L | null; stack: string[]; published: boolean; sortOrder: number };

async function stacks() {
  const links = await requireDb()
    .select({ projectId: projectTechnologies.projectId, name: technologies.name })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(technologies.id, projectTechnologies.technologyId));
  const m = new Map<number, string[]>();
  for (const l of links) m.set(l.projectId, [...(m.get(l.projectId) ?? []), l.name]);
  return m;
}

const toAdmin = (r: typeof projects.$inferSelect, m: Map<number, string[]>): AdminProject => ({
  id: r.id, slug: r.slug, year: r.year, kind: r.kind, status: r.status, access: r.access, progress: r.progress,
  featured: r.featured, framework: r.framework, stack: m.get(r.id) ?? [], title: r.title, summary: r.summary,
  note: r.note, published: r.published, sortOrder: r.sortOrder, updatedAt: r.updatedAt,
});

export async function listPublished(): Promise<ProjectRecord[]> {
  const rows = await requireDb().select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sortOrder));
  const m = await stacks();
  return rows.map((r) => toAdmin(r, m));
}

export async function listAll(): Promise<AdminProject[]> {
  const rows = await requireDb().select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
  const m = await stacks();
  return rows.map((r) => toAdmin(r, m));
}

export async function getById(id: number): Promise<AdminProject | null> {
  const [r] = await requireDb().select().from(projects).where(eq(projects.id, id));
  return r ? toAdmin(r, await stacks()) : null;
}

export async function save(id: number | null, v: ProjectInput): Promise<number> {
  const db = requireDb();
  const { stack, ...cols } = v;
  const values = { ...cols, publishedAt: v.published ? new Date() : null };
  let pid = id;
  if (pid) await db.update(projects).set({ ...values, updatedAt: new Date() }).where(eq(projects.id, pid));
  else [{ id: pid }] = await db.insert(projects).values(values).returning({ id: projects.id });
  // Catatan: driver HTTP tidak mendukung transaksi interaktif; urutan hapus-lalu-isi aman diulang.
  await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, pid!));
  for (const name of stack) {
    await db.insert(technologies).values({ name }).onConflictDoNothing();
    const [t] = await db.select({ id: technologies.id }).from(technologies).where(eq(technologies.name, name));
    await db.insert(projectTechnologies).values({ projectId: pid!, technologyId: t.id }).onConflictDoNothing();
  }
  return pid!;
}

export const setPublished = (id: number, published: boolean) =>
  requireDb().update(projects).set({ published, publishedAt: published ? new Date() : null, updatedAt: new Date() }).where(eq(projects.id, id));
export const remove = (id: number) => requireDb().delete(projects).where(eq(projects.id, id));
