import { asc, eq } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { projects, projectTechnologies, technologies } from "../../db/schema";
import type { ProjectRecord } from "./types";

/** Satu-satunya tempat yang menyentuh tabel proyek. */
export async function listPublished(): Promise<ProjectRecord[]> {
  const db = requireDb();
  const rows = await db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sortOrder));
  const links = await db
    .select({ projectId: projectTechnologies.projectId, name: technologies.name })
    .from(projectTechnologies)
    .innerJoin(technologies, eq(technologies.id, projectTechnologies.technologyId));

  const stackOf = new Map<number, string[]>();
  for (const l of links) stackOf.set(l.projectId, [...(stackOf.get(l.projectId) ?? []), l.name]);

  return rows.map((r) => ({
    slug: r.slug,
    year: r.year,
    kind: r.kind,
    status: r.status,
    access: r.access,
    progress: r.progress,
    framework: r.framework,
    stack: stackOf.get(r.id) ?? [],
    title: r.title,
    summary: r.summary,
    note: r.note,
  }));
}
