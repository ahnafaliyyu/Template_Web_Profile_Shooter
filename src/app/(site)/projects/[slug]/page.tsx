import { notFound } from "next/navigation";
import { listProjects } from "@/server/modules/projects/service";
import ProjectBrowser from "../ProjectBrowser";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await listProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await listProjects()).find((x) => x.slug === slug);
  return { title: p?.title ?? "Projects", description: p?.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await listProjects();
  if (!items.some((p) => p.slug === slug)) notFound();
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />2023–2026 // Karya terpilih</p>
      <h1>Arsip karya.</h1>
      <ProjectBrowser items={items} initial={slug} />
    </section>
  );
}
