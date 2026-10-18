import { notFound } from "next/navigation";
import * as repo from "@/server/modules/projects/repo";
import * as revisions from "@/server/modules/revisions/repo";
import { deleteProject, removeProjectImage, restoreProject, saveProject, uploadProjectImage } from "@/server/modules/projects/actions";
import ProjectForm from "../ProjectForm";

const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

export default async function EditProject({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { id } = await params;
  const { ok, err } = await searchParams;
  const pid = Number(id);
  const v = Number.isInteger(pid) ? await repo.getById(pid).catch(() => null) : null;
  if (!v) notFound();
  const [images, revs] = await Promise.all([repo.listImages(pid).catch(() => []), revisions.list("project", pid).catch(() => [])]);
  return (
    <>
      <h1>{v.title.id}</h1>
      {ok && <p className="flash">Tersimpan. Halaman publik sudah diperbarui.</p>}
      {err && <p className="flash err" role="alert">{err}</p>}
      <ProjectForm action={saveProject.bind(null, pid)} v={v} />

      <div className="card" style={{ marginTop: 28 }}>
        <h2>Tangkapan layar</h2>
        <div className="row" style={{ marginBottom: 12 }}>
          {images.map((im) => (
            <form key={im.id} action={removeProjectImage.bind(null, pid, im.id)} style={{ display: "grid", gap: 4 }}>
              <img src={im.url} alt={im.alt} width={120} height={80} style={{ objectFit: "cover", border: "1px solid var(--ink)" }} />
              <button className="btn o s">Hapus</button>
            </form>
          ))}
          {!images.length && <p className="mu">Belum ada gambar. Situs menampilkan kotak “belum ada”.</p>}
        </div>
        <form className="fm" action={uploadProjectImage.bind(null, pid)}>
          <div className="f2">
            <label>Berkas (PNG, JPEG, WebP, AVIF, maks. 4 MB)<input type="file" name="file" accept="image/png,image/jpeg,image/webp,image/avif" required /></label>
            <label>Teks alternatif<input name="alt" maxLength={200} /></label>
          </div>
          <button className="btn o s">Unggah gambar</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Riwayat versi</h2>
        {revs.length ? (
          <table className="tbl"><tbody>
            {revs.map((r) => (
              <tr key={r.id}>
                <td className="mu">{fmt.format(r.createdAt)}</td><td>@{r.actor}</td>
                <td><form action={restoreProject.bind(null, pid, r.id)}><button className="btn o s">Pulihkan</button></form></td>
              </tr>
            ))}
          </tbody></table>
        ) : <p className="mu">Setiap simpan menyimpan salinan versi sebelumnya di sini.</p>}
      </div>

      <form action={deleteProject.bind(null, pid)} style={{ marginTop: 28 }}><button className="btn o s">Hapus proyek ini</button></form>
    </>
  );
}
