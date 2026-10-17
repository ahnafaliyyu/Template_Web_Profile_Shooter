import { eq } from "drizzle-orm";
import { requireDb } from "./client";
import { sampleProjects } from "./sample";
import { projects, projectTechnologies, technologies } from "./schema";

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
  console.log(`Seed selesai: ${sampleProjects.length} proyek.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
