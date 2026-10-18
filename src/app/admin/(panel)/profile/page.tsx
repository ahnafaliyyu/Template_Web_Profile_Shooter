import { restoreProfile, saveProfileAction, uploadProfilePhoto } from "@/server/modules/profile/actions";
import * as revisions from "@/server/modules/revisions/repo";
import { getProfileRaw } from "@/server/modules/profile/service";

export const dynamic = "force-dynamic";

export default async function AdminProfile({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const p = await getProfileRaw();
  const revs = await revisions.list("profile", 1).catch(() => []);
  const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });
  return (
    <>
      <h1>Profil dan status.</h1>
      {ok && <p className="flash">Tersimpan. Halaman publik sudah diperbarui.</p>}
      {err && <p className="flash err" role="alert">{err}</p>}
      <form className="fm" action={saveProfileAction}>
        <label>Nama<input name="name" required defaultValue={p.name} /></label>
        <div className="f2">
          <label>Peran (Indonesia)<input name="role_id" required defaultValue={p.role.id} /></label>
          <label>Peran (Inggris)<input name="role_en" defaultValue={p.role.en} /></label>
        </div>
        <div className="f2">
          <label>Bio (Indonesia)<textarea name="bio_id" rows={6} required defaultValue={p.bio.id} /></label>
          <label>Bio (Inggris)<textarea name="bio_en" rows={6} defaultValue={p.bio.en} /></label>
        </div>
        <div className="f2">
          <label>Status ketersediaan (Indonesia)<input name="availability_id" defaultValue={p.availability?.id} /></label>
          <label>Status ketersediaan (Inggris)<input name="availability_en" defaultValue={p.availability?.en} /></label>
        </div>
        <div className="f2">
          <label>Fokus (Indonesia)<input name="focus_id" defaultValue={p.focus?.id} /></label>
          <label>Fokus (Inggris)<input name="focus_en" defaultValue={p.focus?.en} /></label>
        </div>
        <label>Kalimat yang berganti di Home (satu per baris)<textarea name="tags" rows={4} defaultValue={(p.extra?.tags ?? []).join("\n")} /><small className="mu">Dibaca setelah “Saya membangun …”. Contoh: sistem IoT</small></label>
        <div className="f2">
          <label>Email<input name="email" defaultValue={p.extra?.email} /></label>
          <label>Lokasi<input name="location" defaultValue={p.extra?.location} /></label>
        </div>
        <label>Tautan (satu per baris: Nama|alamat)<textarea name="links" rows={4} defaultValue={(p.extra?.links ?? []).map((l) => `${l.label}|${l.url}`).join("\n")} /></label>
        <button className="btn">Simpan</button>
      </form>

      <div className="card" style={{ marginTop: 28 }}>
        <h2>Foto profil</h2>
        {p.extra?.photo && <img src={p.extra.photo} alt="Foto profil" width={120} height={150} style={{ objectFit: "cover", border: "1px solid var(--ink)", marginBottom: 10 }} />}
        <form className="fm" action={uploadProfilePhoto}>
          <label>Berkas (PNG, JPEG, WebP, AVIF, maks. 4 MB)<input type="file" name="file" accept="image/png,image/jpeg,image/webp,image/avif" required /></label>
          <button className="btn o s">Unggah foto</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>Riwayat versi</h2>
        {revs.length ? (
          <table className="tbl"><tbody>
            {revs.map((r) => (
              <tr key={r.id}><td className="mu">{fmt.format(r.createdAt)}</td><td>@{r.actor}</td><td><form action={restoreProfile.bind(null, r.id)}><button className="btn o s">Pulihkan</button></form></td></tr>
            ))}
          </tbody></table>
        ) : <p className="mu">Setiap simpan menyimpan salinan versi sebelumnya di sini.</p>}
      </div>
    </>
  );
}
