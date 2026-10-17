import * as repo from "@/server/modules/credentials/repo";
import { addCredential, deleteCredential, toggleCredential } from "@/server/modules/credentials/actions";

export default async function AdminCredentials({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  const items = await repo.list().catch(() => null);
  return (
    <>
      <h1>Kredensial.</h1>
      {err && <p className="flash err" role="alert">{err}</p>}
      <form className="fm" action={addCredential} style={{ marginBottom: 24 }}>
        <div className="f2">
          <label>Jenis<select name="kind"><option value="pendidikan">Pendidikan</option><option value="sertifikat">Sertifikat</option><option value="publikasi">Publikasi</option><option value="penghargaan">Penghargaan</option></select></label>
          <label>Tahun (opsional)<input name="year" type="number" /></label>
        </div>
        <div className="f2">
          <label>Judul (Indonesia)<input name="title_id" required /></label>
          <label>Judul (Inggris)<input name="title_en" /></label>
        </div>
        <div className="f2">
          <label>Penerbit atau institusi<input name="issuer" /></label>
          <label>Tautan (opsional)<input name="url" placeholder="https://" /></label>
        </div>
        <label className="ck"><input type="checkbox" name="published" defaultChecked />Terbitkan di situs</label>
        <button className="btn">Tambah kredensial</button>
      </form>
      {!items ? <div className="card">Database belum terhubung. Situs memakai data contoh.</div> : !items.length ? <p className="mu">Belum ada kredensial di database; situs memakai data contoh sampai kamu menambahkan.</p> : (
        <table className="tbl">
          <thead><tr><th>Jenis</th><th>Judul</th><th>Tahun</th><th /></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.kind}</td><td><b>{c.title.id}</b><br /><span className="mu">{c.issuer}</span></td><td>{c.year ?? "—"}</td>
                <td className="row">
                  <form action={toggleCredential.bind(null, c.id, !c.published)}><button className="btn o s">{c.published ? "Terbit · sembunyikan" : "Draf · terbitkan"}</button></form>
                  <form action={deleteCredential.bind(null, c.id)}><button className="btn o s">Hapus</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
