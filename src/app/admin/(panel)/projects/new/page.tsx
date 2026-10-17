import { saveProject } from "@/server/modules/projects/actions";
import ProjectForm from "../ProjectForm";

export default async function NewProject({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  return (
    <>
      <h1>Proyek baru.</h1>
      {err && <p className="flash err" role="alert">{err}</p>}
      <ProjectForm action={saveProject.bind(null, null)} />
    </>
  );
}
