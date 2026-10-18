import { pick, type Locale } from "@/lib/i18n";
import { sampleProjects } from "../../db/sample";
import { listPublished } from "./repo";
import type { ProjectRecord, ProjectView } from "./types";

const toView = (r: ProjectRecord, locale: Locale): ProjectView => ({
  slug: r.slug,
  year: r.year,
  kind: r.kind,
  status: r.status,
  access: r.access,
  progress: r.progress,
  featured: r.featured,
  framework: r.framework ?? "",
  stack: r.stack,
  title: pick(r.title, locale),
  summary: pick(r.summary, locale),
  note: pick(r.note, locale),
  images: r.images,
});

/** Situs tetap tampil walau database mati atau belum diatur: jatuh ke data cadangan. */
export async function listProjects(locale: Locale = "id"): Promise<ProjectView[]> {
  try {
    const rows = await listPublished();
    if (rows.length) return rows.map((r) => toView(r, locale));
  } catch (e) {
    console.error("[projects] database tidak tersedia, memakai data cadangan:", (e as Error).message);
  }
  return sampleProjects.map((r) => toView(r, locale));
}
