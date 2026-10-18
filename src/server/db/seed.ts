import { eq } from "drizzle-orm";
import { requireDb } from "./client";
import { count } from "drizzle-orm";
import { sampleCredentials, sampleProfile, sampleProjects, sampleSkills } from "./sample";
import { credentials, profile, projects, projectTechnologies, skills, technologies } from "./schema";

async function main() {
  const db = requireDb();
  for (const [i, p] of sampleProjects.entries()) {
    const values = {
      title: p.title, summary: p.summary, note: p.note, kind: p.kind, year: p.year,
      status: p.status, access: p.access, progress: p.progress, framework: p.framework,
      sortOrder: i, published: true, publishedAt: new Date(),
    };
    const [row] = await db
      .insert(projects)
      .values({ slug: p.slug, ...values })
      .onConflictDoUpdate({ target: projects.slug, set: { ...values, updatedAt: new Date() } })
      .returning({ id: projects.id });

    for (const name of p.stack) {
      await db.insert(technologies).values({ name }).onConflictDoNothing();
      const [t] = await db.select({ id: technologies.id }).from(technologies).where(eq(technologies.name, name));
      await db.insert(projectTechnologies).values({ projectId: row.id, technologyId: t.id }).onConflictDoNothing();
    }
  }
  // Profil, skill, dan kredensial contoh hanya diisi bila masih kosong, supaya tidak menimpa yang sudah kamu ubah di admin.
  await db.insert(profile).values({ id: 1, ...sampleProfile }).onConflictDoNothing();
  const [sk] = await db.select({ n: count() }).from(skills);
  if (!sk.n) await db.insert(skills).values(sampleSkills.map((s, i) => ({ ...s, sortOrder: i })));
  const [cr] = await db.select({ n: count() }).from(credentials);
  if (!cr.n) await db.insert(credentials).values(sampleCredentials.map((c, i) => ({ ...c, sortOrder: i, published: true })));
  console.log(`Seed selesai: ${sampleProjects.length} proyek, profil, skill, dan kredensial contoh.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
