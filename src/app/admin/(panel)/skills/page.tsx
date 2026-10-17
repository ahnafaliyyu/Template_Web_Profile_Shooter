import * as repo from "@/server/modules/skills/repo";
import { addSkill, deleteSkill, toggleSkillFeatured } from "@/server/modules/skills/actions";

export default async function AdminSkills({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  const items = await repo.list().catch(() => null);
  return (
    <>
      <h1>Skill.</h1>
      {err && <p className="flash err" role="alert">{err}</p>}
      <form className="fm" action={addSkill} style={{ marginBottom: 24 }}>
        <div className="f3">
          <label>Nama<input name="name" required /></label>
          <label>Kelompok<input name="group" required placeholder="mis. Web dan backend" /></label>
          <label>Tingkat 1–5 (opsional)<input name="level" type="number" min={1} max={5} /></label>
        </div>
        <label className="ck"><input type="checkbox" name="featured" />Tampilkan di Arsenal (Home)</label>
        <button className="btn">Tambah skill</button>
      </form>
      {!items ? <div className="card">Database belum terhubung. Situs memakai data contoh.</div> : !items.length ? <p className="mu">Belum ada skill di database; situs memakai data contoh sampai kamu menambahkan.</p> : (
        <table className="tbl">
          <thead><tr><th>Skill</th><th>Kelompok</th><th>Tingkat</th><th /></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td><b>{s.name}</b></td><td>{s.group}</td><td>{s.level ?? "—"}</td>
                <td className="row">
                  <form action={toggleSkillFeatured.bind(null, s.id, !s.featured)}><button className="btn o s">{s.featured ? "Unggulan · lepas" : "Jadikan unggulan"}</button></form>
                  <form action={deleteSkill.bind(null, s.id)}><button className="btn o s">Hapus</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
