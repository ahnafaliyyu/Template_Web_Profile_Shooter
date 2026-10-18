import { and, asc, eq, isNull, lte, or } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { projectMedia, projects, projectTechnologies, technologies, type L } from "../../db/schema";
import type { ProjectRecord } from "./types";

/** Satu-satunya tempat yang menyentuh tabel proyek. */
export type AdminProject = ProjectRecord & { id: number; published: boolean; sortOrder: number; updatedAt: Date; publishedAt: Date | null };
export type ProjectInput = Omit<ProjectRecord, "stack" | "note" | "images"> & {
  note: L | null; stack: string[]; published: boolean; sortOrder: number; publishAt: Date | null;
};
/** Bentuk yang disimpan di riwayat versi. */
export type ProjectSnapshot = Omit<ProjectInput, "publishAt">;

async function lookups() {
  const db = requireDb();
  const links = await db
    .select({ projectId: projectTechnologies.projectId, name: technologies.name })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(technologies.id, projectTechnologies.technologyId));
  const media = await db.select().from(projectMedia).orderBy(asc(projectMedia.sortOrder), asc(projectMedia.id));
  const stack = new Map<number, string[]>();
  for (const l of links) stack.set(l.projectId, [...(stack.get(l.projectId) ?? []), l.name]);
  const images = new Map<number, { url: string; alt: string }[]>();
  for (const m of media) images.set(m.projectId, [...(images.get(m.projectId) ?? []), { url: m.url, alt: m.alt }]);
  return { stack, images };
}

const toAdmin = (r: typeof projects.$inferSelect, x: Awaited<ReturnType<typeof lookups>>): AdminProject => ({
  id: r.id, slug: r.slug, year: r.year, kind: r.kind, status: r.status, access: r.access, progress: r.progress,
  featured: r.featured, framework: r.framework, stack: x.stack.get(r.id) ?? [], images: x.images.get(r.id) ?? [],
  title: r.title, summary: r.summary, note: r.note, published: r.published, sortOrder: r.sortOrder,
  updatedAt: r.updatedAt, publishedAt: r.publishedAt,
});

/** Terbit = ditandai terbit DAN waktu terbitnya sudah lewat (mendukung jadwal terbit). */
export async function listPublished(): Promise<ProjectRecord[]> {
  const rows = await requireDb().select().from(projects)
    .where(and(eq(projects.published, true), or(isNull(projects.publishedAt), lte(projects.publishedAt, new Date()))))
    .orderBy(asc(projects.sortOrder), asc(projects.id));
  const x = await lookups();
  return rows.map((r) => toAdmin(r, x));
}

export async function listAll(): Promise<AdminProject[]> {
  const rows = await requireDb().select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
  const x = await lookups();
  return rows.map((r) => toAdmin(r, x));
}

export async function getById(id: number): Promise<AdminProject | null> {
  const [r] = await requireDb().select().from(projects).where(eq(projects.id, id));
  return r ? toAdmin(r, await lookups()) : null;
}

export const toSnapshot = (p: AdminProject): ProjectSnapshot => ({
  slug: p.slug, title: p.title, summary: p.summary, note: p.note, kind: p.kind, year: p.year, status: p.status, access: p.access,
  progress: p.progress, framework: p.framework, featured: p.featured, stack: p.stack, published: p.published, sortOrder: p.sortOrder,
});

export async function save(id: number | null, v: ProjectInput): Promise<number> {
  const db = requireDb();
  const { stack, publishAt, ...cols } = v;
  let pid = id;
  if (pid) {
    const [cur] = await db.select({ publishedAt: projects.publishedAt }).from(projects).where(eq(projects.id, pid));
    const publishedAt = v.published ? (publishAt ?? cur?.publishedAt ?? new Date()) : null;
    await db.update(projects).set({ ...cols, publishedAt, updatedAt: new Date() }).where(eq(projects.id, pid));
  } else {
    [{ id: pid }] = await db.insert(projects).values({ ...cols, publishedAt: v.published ? (publishAt ?? new Date()) : null }).returning({ id: projects.id });
  }
  // Driver HTTP tidak mendukung transaksi interaktif; urutan hapus-lalu-isi aman diulang bila gagal di tengah.
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

// ---- gambar ----
export const listImages = (projectId: number) => requireDb().select().from(projectMedia).where(eq(projectMedia.projectId, projectId)).orderBy(asc(projectMedia.sortOrder), asc(projectMedia.id));
export const addImage = (projectId: number, url: string, alt: string) => requireDb().insert(projectMedia).values({ projectId, url, alt });
export async function removeImage(id: number) {
  const [r] = await requireDb().delete(projectMedia).where(eq(projectMedia.id, id)).returning({ url: projectMedia.url });
  return r?.url ?? null;
}
