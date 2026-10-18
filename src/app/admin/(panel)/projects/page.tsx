import Link from "next/link";
import * as repo from "@/server/modules/projects/repo";
import { togglePublished } from "@/server/modules/projects/actions";

export default async function AdminProjects() {
  const items = await repo.listAll().catch(() => null);
  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Proyek.</h1>
        <Link className="btn" href="/admin/projects/new">Proyek baru</Link>
      </div>
      {!items ? <div className="card">Database belum terhubung.</div> : !items.length ? <div className="card">Belum ada proyek. Jalankan <code>npm run db:seed</code> atau buat proyek baru.</div> : (
        <table className="tbl">
          <thead><tr><th>#</th><th>Judul</th><th>Status</th><th>Akses</th><th>Terbit</th><th /></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td className="mu">{p.sortOrder}</td>
                <td><b>{p.title.id}</b>{p.featured && <span className="chip" style={{ marginLeft: 8 }}>Unggulan</span>}</td>
                <td>{p.status}</td><td>{p.access}</td>
                <td><form action={togglePublished.bind(null, p.id, !p.published)}><button className="btn o s">{p.published ? (p.publishedAt && p.publishedAt > new Date() ? "Terjadwal · tarik" : "Terbit · tarik") : "Draf · terbitkan"}</button></form></td>
                <td><Link href={`/admin/projects/${p.id}`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
