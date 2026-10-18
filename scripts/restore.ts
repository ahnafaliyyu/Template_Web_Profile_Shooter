// Pulihkan cadangan: npm run db:restore -- berkas.json
// Hanya menambah baris yang belum ada; tidak menimpa data yang sudah ada.
import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { requireDb } from "../src/server/db/client";
import * as t from "../src/server/db/schema";

const TABLES: Record<string, { table: PgTable; serial?: string }> = {
  profile: { table: t.profile },
  technologies: { table: t.technologies, serial: "technologies" },
  projects: { table: t.projects, serial: "projects" },
  project_technologies: { table: t.projectTechnologies },
  project_media: { table: t.projectMedia, serial: "project_media" },
  skills: { table: t.skills, serial: "skills" },
  credentials: { table: t.credentials, serial: "credentials" },
  site_settings: { table: t.siteSettings },
  guestbook_entries: { table: t.guestbookEntries, serial: "guestbook_entries" },
  contact_messages: { table: t.contactMessages, serial: "contact_messages" },
};

const ISO = /^\d{4}-\d{2}-\d{2}T/;
const revive = (row: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [k, typeof v === "string" && k.endsWith("At") && ISO.test(v) ? new Date(v) : v]));

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Pemakaian: npm run db:restore -- berkas.json");
  const data = JSON.parse(readFileSync(file, "utf8")) as { version: number; tables: Record<string, Record<string, unknown>[]> };
  if (data.version !== 1) throw new Error("Versi berkas cadangan tidak dikenal.");
  const db = requireDb();
  for (const [name, { table, serial }] of Object.entries(TABLES)) {
    const rows = (data.tables[name] ?? []).map(revive);
    for (let i = 0; i < rows.length; i += 100) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db.insert(table) as any).values(rows.slice(i, i + 100)).onConflictDoNothing();
    }
    if (serial && rows.length) await db.execute(sql.raw(`select setval(pg_get_serial_sequence('${serial}','id'), (select coalesce(max(id),1) from ${serial}))`));
    console.log(`${name}: ${rows.length} baris diproses`);
  }
  console.log("Selesai.");
}
main().catch((e) => { console.error(e.message); process.exit(1); });
