import { notFound } from "next/navigation";
import * as repo from "@/server/modules/projects/repo";
import { deleteProject, saveProject } from "@/server/modules/projects/actions";
import ProjectForm from "../ProjectForm";

export default async function EditProject({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { id } = await params;
  const { ok, err } = await searchParams;
  const pid = Number(id);
  const v = Number.isInteger(pid) ? await repo.getById(pid).catch(() => null) : null;
  if (!v) notFound();
  return (
    <>
      <h1>{v.title.id}</h1>
      {ok && <p className="flash">Tersimpan. Halaman publik sudah diperbarui.</p>}
      {err && <p className="flash err" role="alert">{err}</p>}
      <ProjectForm action={saveProject.bind(null, pid)} v={v} />
      <form action={deleteProject.bind(null, pid)} style={{ marginTop: 28 }}><button className="btn o s">Hapus proyek ini</button></form>
    </>
  );
}
