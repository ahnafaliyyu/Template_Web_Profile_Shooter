import Link from "next/link";
import { getDashboard } from "@/server/modules/dashboard/service";

const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });
const ago = (d: Date) => `${Math.floor((Date.now() - d.getTime()) / 86400_000)} hari lalu`;

function Spark({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 200},${38 - (v / max) * 34}`).join(" ");
  return <svg viewBox="0 0 200 40" width="100%" height="40" aria-hidden="true"><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export default async function Dashboard() {
  const d = await getDashboard();
  if (!d.ok) {
    return (
      <>
        <h1>Ringkasan.</h1>
        <div className="card"><h2>Database belum terhubung</h2><p>{d.reason}</p><p className="mu">Ikuti PANDUAN.md bagian “Menyiapkan database”, lalu muat ulang halaman ini. Situs publik tetap tampil memakai data cadangan.</p></div>
      </>
    );
  }
  return (
    <>
      <h1>Ringkasan.</h1>
      <div className="grid">
        <div className="card">
          <h2>Kesehatan situs</h2>
          <p className="big">● Sehat</p>
          <p>Database merespons dalam {d.latencyMs} ms.</p>
          <p className="mu">Lingkungan: {d.build.env}{d.build.commit ? ` · build ${d.build.commit}` : ""}</p>
          <p className="mu">Unggah gambar: {d.build.blob ? "siap" : "belum diatur (BLOB_READ_WRITE_TOKEN)"}</p>
          <p className="mu">Cadangan terakhir: {d.lastExport ? fmt.format(d.lastExport) : "belum pernah"}</p>
        </div>
        <div className="card">
          <h2>Perlu ditangani</h2>
          <ul>
            <li><Link href="/admin/messages">Pesan masuk baru: {d.newMessages}</Link></li>
            <li><Link href="/admin/guestbook">Buku tamu menunggu: {d.pendingGuestbook}</Link></li>
            <li><Link href="/admin/projects">Proyek draf belum terbit: {d.drafts}</Link></li>
          </ul>
        </div>
        <div className="card">
          <h2>Perlu diperbarui (&gt; {d.staleDays} hari)</h2>
          <ul>
            {d.profileMissing && <li><Link href="/admin/profile">Profil belum diisi (situs memakai data contoh)</Link></li>}
            {d.profileStale && <li><Link href="/admin/profile">Profil dan status</Link></li>}
            {d.stale.map((p) => <li key={p.id}><Link href={`/admin/projects/${p.id}`}>{p.title.id}</Link> <span className="mu">· {ago(p.updatedAt)}</span></li>)}
            {!d.profileMissing && !d.profileStale && !d.stale.length && <li className="mu">Semua konten masih segar.</li>}
          </ul>
        </div>
      </div>
      <div className="grid">
        <div className="card">
          <h2>Kunjungan</h2>
          <p className="big">{d.visits.total7} <span className="mu" style={{ fontSize: "1rem", fontWeight: 400 }}>7 hari · {d.visits.total30} dalam 30 hari</span></p>
          <Spark data={d.visits.series} />
          {d.visits.topPaths.length > 0 && <ul style={{ marginTop: 8 }}>{d.visits.topPaths.map((p) => <li key={p.path}>{p.path} <span className="mu">· {p.n}</span></li>)}</ul>}
          {d.visits.countries.length > 0 && <p className="mu">Negara: {d.visits.countries.map((c) => `${c.country} ${c.n}`).join(" · ")}</p>}
          {!d.visits.total30 && <p className="mu">Belum ada kunjungan tercatat.</p>}
        </div>
        <div className="card">
          <h2>Terbit saat ini</h2>
          <p className="big">{d.published}</p>
          <p className="mu">proyek tampil di situs publik</p>
          <h2 style={{ marginTop: 14 }}>Aksi cepat</h2>
          <div className="row">
            <Link className="btn s" href="/admin/projects/new">Proyek baru</Link>
            <Link className="btn o s" href="/admin/profile">Ubah status ketersediaan</Link>
            <Link className="btn o s" href="/admin/backup">Unduh cadangan</Link>
          </div>
        </div>
      </div>
      <div className="card">
        <h2>Aktivitas terakhir</h2>
        {d.recent.length ? (
          <table className="tbl"><tbody>
            {d.recent.map((r) => <tr key={r.id}><td className="mu">{fmt.format(r.createdAt)}</td><td>@{r.actor} {r.action} {r.entity}{r.entityId ? ` #${r.entityId}` : ""}</td></tr>)}
          </tbody></table>
        ) : <p className="mu">Belum ada aktivitas.</p>}
      </div>
    </>
  );
}
