import { listProjects } from "@/server/modules/projects/service";
import ProjectBrowser from "./ProjectBrowser";

export const revalidate = 3600;
export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const items = await listProjects();
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />2023–2026 // Karya terpilih</p>
      <h1>Arsip karya.</h1>
      <ProjectBrowser items={items} />
    </section>
  );
}
