import { saveProfileAction } from "@/server/modules/profile/actions";
import { getProfileRaw } from "@/server/modules/profile/service";

export const dynamic = "force-dynamic";

export default async function AdminProfile({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const p = await getProfileRaw();
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
    </>
  );
}
