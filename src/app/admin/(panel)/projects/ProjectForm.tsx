import type { AdminProject } from "@/server/modules/projects/repo";

export default function ProjectForm({ action, v }: { action: (fd: FormData) => Promise<void>; v?: AdminProject }) {
  return (
    <form className="fm" action={action}>
      <div className="f2">
        <label>Judul (Indonesia)<input name="title_id" required defaultValue={v?.title.id} /></label>
        <label>Judul (Inggris, opsional)<input name="title_en" defaultValue={v?.title.en} /></label>
      </div>
      <label>Slug (alamat halaman)<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={v?.slug} /><small className="mu">contoh: irigasi-cerdas-esp32</small></label>
      <div className="f2">
        <label>Ringkasan (Indonesia)<textarea name="summary_id" rows={4} required defaultValue={v?.summary.id} /></label>
        <label>Ringkasan (Inggris)<textarea name="summary_en" rows={4} defaultValue={v?.summary.en} /></label>
      </div>
      <div className="f2">
        <label>Catatan (Indonesia)<input name="note_id" defaultValue={v?.note?.id} /></label>
        <label>Catatan (Inggris)<input name="note_en" defaultValue={v?.note?.en} /></label>
      </div>
      <div className="f3">
        <label>Jenis<input name="kind" required defaultValue={v?.kind ?? "IoT"} /></label>
        <label>Tahun<input name="year" type="number" required defaultValue={v?.year ?? new Date().getFullYear()} /></label>
        <label>Urutan<input name="sortOrder" type="number" defaultValue={v?.sortOrder ?? 0} /></label>
      </div>
      <div className="f3">
        <label>Status<select name="status" defaultValue={v?.status ?? "konsep"}><option value="aktif">Aktif</option><option value="selesai">Selesai</option><option value="konsep">Konsep</option></select></label>
        <label>Akses<select name="access" defaultValue={v?.access ?? "privat"}><option value="publik">Publik</option><option value="privat">Privat</option></select></label>
        <label>Progres (0–100)<input name="progress" type="number" min={0} max={100} defaultValue={v?.progress ?? 0} /></label>
      </div>
      <label>Kerangka<input name="framework" defaultValue={v?.framework ?? ""} /></label>
      <label>Stack (pisahkan dengan koma)<input name="stack" defaultValue={v?.stack.join(", ")} /></label>
      <div className="row">
        <label className="ck"><input type="checkbox" name="published" defaultChecked={v?.published} />Terbitkan di situs</label>
        <label className="ck"><input type="checkbox" name="featured" defaultChecked={v?.featured} />Karya unggulan (tampil di Home)</label>
      </div>
      <button className="btn">Simpan</button>
    </form>
  );
}
