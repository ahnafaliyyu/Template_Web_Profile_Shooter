import { requireDb } from "../../db/client";
import * as t from "../../db/schema";

/** Seluruh konten dalam satu berkas JSON. Urutan tabel = urutan aman untuk dipulihkan. */
export async function exportAll() {
  const db = requireDb();
  const tables = {
    profile: await db.select().from(t.profile),
    technologies: await db.select().from(t.technologies),
    projects: await db.select().from(t.projects),
    project_technologies: await db.select().from(t.projectTechnologies),
    project_media: await db.select().from(t.projectMedia),
    skills: await db.select().from(t.skills),
    credentials: await db.select().from(t.credentials),
    site_settings: await db.select().from(t.siteSettings),
    guestbook_entries: await db.select().from(t.guestbookEntries),
    contact_messages: await db.select().from(t.contactMessages),
  };
  return { version: 1, exportedAt: new Date().toISOString(), tables };
}
