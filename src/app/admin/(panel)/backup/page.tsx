export default function Backup() {
  return (
    <>
      <h1>Cadangan.</h1>
      <div className="card" style={{ maxWidth: 720 }}>
        <h2>Unduh seluruh konten</h2>
        <p>Satu berkas JSON berisi profil, proyek, skill, kredensial, pengaturan, buku tamu, dan pesan masuk. Gambar disimpan terpisah di Vercel Blob; berkas ini hanya menyimpan alamatnya.</p>
        <p><a className="btn" href="/admin/backup/export">Unduh cadangan (JSON)</a></p>
        <p className="mu">Unduh rutin, misalnya sebulan sekali, dan simpan di tempat yang aman.</p>
      </div>
      <div className="card" style={{ maxWidth: 720, marginTop: 14 }}>
        <h2>Memulihkan</h2>
        <p>Di komputermu, dari folder proyek:</p>
        <p><code>npm run db:restore -- cadangan-portofolio-2026-10-17.json</code></p>
        <p className="mu">Pemulihan hanya menambah data yang belum ada dan tidak menimpa yang sudah ada. Lihat PANDUAN.md untuk langkah lengkap, termasuk memulihkan ke database baru.</p>
      </div>
    </>
  );
}
