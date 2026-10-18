import { saveSettings } from "@/server/modules/settings/actions";
import { getSettingsRaw } from "@/server/modules/settings/service";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  const s = await getSettingsRaw();
  return (
    <>
      <h1>Tampilan situs.</h1>
      {ok && <p className="flash">Tersimpan. Halaman publik sudah diperbarui.</p>}
      {err && <p className="flash err" role="alert">{err}</p>}
      <form className="fm" action={saveSettings}>
        <label>Chip lokasi di header<input name="locChip" required defaultValue={s.locChip} /></label>
        <div className="f2">
          <label>Footer kiri (Indonesia)<input name="footerLeft_id" required defaultValue={s.footerLeft.id} /></label>
          <label>Footer kiri (Inggris)<input name="footerLeft_en" defaultValue={s.footerLeft.en} /></label>
        </div>
        <div className="f2">
          <label>Footer kanan (Indonesia)<input name="footerRight_id" required defaultValue={s.footerRight.id} /></label>
          <label>Footer kanan (Inggris)<input name="footerRight_en" defaultValue={s.footerRight.en} /></label>
        </div>
        <div className="f2">
          <label>Judul panel ajakan di Home (Indonesia)<input name="dispatch_id" required defaultValue={s.dispatchTitle.id} /></label>
          <label>Judul panel ajakan di Home (Inggris)<input name="dispatch_en" defaultValue={s.dispatchTitle.en} /></label>
        </div>
        <button className="btn">Simpan</button>
      </form>
    </>
  );
}
