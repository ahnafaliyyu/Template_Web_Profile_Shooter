# Panduan pemakaian

Panduan ini untuk kamu yang baru pertama kali menjalankan dan mengelola situs ini. Ikuti berurutan; tiap bagian berdiri sendiri bila kamu hanya butuh satu hal.

**Alamat penting**

| Alamat | Fungsi |
|---|---|
| `/id` dan `/en` | situs publik dalam Indonesia dan Inggris |
| `/admin` | dashboard dan pengelolaan (hanya akunmu) |
| `/api/health` | status situs, untuk pemantau uptime |

---

## 1. Menjalankan di komputer

Kebutuhan: Node.js versi 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`. Tanpa database pun situs publik sudah tampil memakai data contoh (`src/server/db/sample.ts`). Admin baru bisa dipakai setelah bagian 2 dan 3.

Perintah `npm run doctor` memeriksa pengaturanmu dan menunjukkan apa yang masih kurang. Jalankan kapan pun ada yang terasa tidak beres.

## 2. Menyiapkan database (Neon)

1. Daftar di neon.tech, lalu buat project baru.
2. Di dashboard Neon, salin **connection string** (berawalan `postgresql://`).
3. Tempel ke `.env.local` sebagai `DATABASE_URL=...`.
4. Buat tabel dan isi data contoh:

```bash
npm run db:migrate
npm run db:seed
```

5. Jalankan `npm run doctor`. Dua baris pertama tentang database harus bertanda ✓.

`db:seed` mengisi proyek, profil, skill, dan kredensial contoh. Profil, skill, dan kredensial hanya diisi bila masih kosong, jadi aman dijalankan ulang tanpa menimpa yang sudah kamu ubah. Proyek dengan slug yang sama akan diperbarui ke data contoh, jadi jangan menjalankan seed ulang setelah kamu mengedit proyek contoh di admin.

## 3. Login admin (GitHub)

1. Di GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Isi:
   - Homepage URL: `http://localhost:3000` (nanti diganti alamat situsmu)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Salin **Client ID** dan buat **Client secret**.
4. Isi `.env.local`:

```
AUTH_SECRET=...            # hasil dari: npx auth secret
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
ADMIN_GITHUB_USERS=username-github-kamu
```

5. Restart `npm run dev`, buka `/admin`, lalu masuk dengan GitHub.

Hanya username di `ADMIN_GITHUB_USERS` yang diterima. Akun lain melihat pesan “Akun GitHub ini tidak diizinkan”. Saat situs sudah tayang, buat OAuth App kedua dengan alamat produksi (satu OAuth App hanya punya satu callback).

## 4. Unggah gambar (Vercel Blob), opsional

Dibutuhkan untuk foto profil dan tangkapan layar proyek.

1. Di dashboard Vercel: **Storage → Create → Blob**, hubungkan ke project.
2. Salin tokennya ke `.env.local` sebagai `BLOB_READ_WRITE_TOKEN=...`.
3. Format yang diterima: PNG, JPEG, WebP, AVIF, maksimal 4 MB per gambar.

Tanpa token, form unggah menampilkan pesan yang jelas dan bagian lain tetap berfungsi.

## 5. Tayang di internet (Vercel)

1. Dorong proyek ke repositori GitHub.
2. Di Vercel: **Add New → Project**, pilih repositori itu.
3. Isi semua variabel dari `.env.example` di **Settings → Environment Variables**.
4. Jalankan migrasi ke database produksi dari komputermu sekali saja, dengan `DATABASE_URL` produksi di `.env.local`:

```bash
npm run db:migrate
npm run db:seed
```

5. Deploy. Setelah dapat alamat, ubah **callback URL** di OAuth App produksi menjadi `https://alamat-situsmu/api/auth/callback/github`.
6. Domain sendiri: **Settings → Domains** di Vercel, lalu ikuti petunjuk DNS yang ditampilkan.
7. Pasang pemantau uptime (misalnya UptimeRobot) pada `https://alamat-situsmu/api/health`. Jawabannya `"status":"ok"`, atau `"degraded"` bila database bermasalah (situs publik tetap tampil dari cache).

Setiap kali kamu mengubah skema database (`src/server/db/schema.ts`), jalankan `npm run db:generate`, periksa berkas baru di folder `drizzle/`, lalu `npm run db:migrate`.

## 6. Pemakaian harian di admin

| Yang ingin kamu lakukan | Di mana |
|---|---|
| Ubah status ketersediaan, bio, peran, email, tautan sosial, kalimat yang berganti di Home | **Profil dan status** |
| Ganti foto | **Profil dan status**, bagian “Foto profil” |
| Tambah proyek | **Proyek → Proyek baru** |
| Terbitkan atau tarik proyek | **Proyek**, tombol di kolom “Terbit” |
| Jadwalkan terbit | Form proyek, isian “Jadwal terbit” (waktu UTC; WIB = UTC+7, WITA = UTC+8) |
| Tampilkan proyek di Home | Form proyek, centang “Karya unggulan” |
| Atur urutan | Form proyek, isian “Urutan” (angka kecil tampil lebih dulu) |
| Tambah tangkapan layar | Form proyek, bagian “Tangkapan layar” |
| Kembalikan versi lama | Form proyek atau profil, bagian “Riwayat versi” |
| Tambah skill atau tampilkan di Arsenal | **Skill** |
| Tambah sertifikat, publikasi, penghargaan, pendidikan | **Kredensial** |
| Setujui atau sembunyikan pesan buku tamu | **Buku tamu** |
| Baca dan balas pesan dari halaman Kontak | **Pesan masuk** |
| Ganti teks footer, chip lokasi, judul ajakan di Home | **Tampilan situs** |

Setiap kali kamu menyimpan, halaman publik langsung diperbarui tanpa deploy ulang.

**Membaca dashboard.** Kartu “Kesehatan situs” menunjukkan kecepatan database, lingkungan, dan kapan terakhir kamu mengunduh cadangan. “Perlu ditangani” berisi hal yang menunggumu. “Perlu diperbarui” menandai konten yang lebih dari 90 hari tidak disentuh; ini pengingat, bukan paksaan. “Kunjungan” menampilkan 7 dan 30 hari terakhir. Di bawahnya ada riwayat aktivitas.

## 7. Dua bahasa

- Situs ada di `/id` dan `/en`. Pengunjung diarahkan otomatis menurut pengaturan browser, dan pilihan tombol bahasa diingat.
- Setiap isian punya kolom Indonesia (wajib) dan Inggris (opsional). Bila Inggris kosong, situs menampilkan teks Indonesia, bukan kosong.
- Label tetap seperti “Menu” dan “Progres” ada di `src/lib/dict.ts`.

## 8. Statistik kunjungan

Yang dicatat hanya: tanggal, halaman, negara (dari header Vercel), dan jumlah. Tidak ada cookie, tidak ada IP, tidak ada identitas pengunjung. Browser dengan Do Not Track dan bot tidak dihitung.

## 9. Cadangan dan pemulihan

**Unduh:** **Cadangan → Unduh cadangan (JSON)**. Lakukan rutin dan simpan di tempat aman. Berkasnya memuat profil, proyek, skill, kredensial, pengaturan, buku tamu, dan pesan masuk. Gambar tidak ikut; yang tersimpan hanya alamatnya di Vercel Blob.

**Pulihkan** (misalnya ke database baru):

1. Buat database baru, isi `DATABASE_URL`, lalu `npm run db:migrate`.
2. `npm run db:restore -- cadangan-portofolio-2026-10-17.json`

Pemulihan hanya menambah baris yang belum ada dan tidak menimpa yang sudah ada.

Neon juga punya fitur pemulihan ke titik waktu tertentu di dashboard-nya; lihat dokumentasi Neon untuk batas waktunya sesuai paketmu.

## 10. Mengubah kode

- Halaman publik: `src/app/[locale]/…`
- Admin: `src/app/admin/…`
- Setiap bidang data punya folder di `src/server/modules/<nama>` dengan pola yang sama: `repo` (satu-satunya yang menyentuh database), `service` (aturan dan jalur cadangan), `actions` (aksi admin atau formulir publik).
- Setiap halaman admin dan setiap aksi admin memanggil `requireAdmin()`. Pertahankan ini saat menambah fitur.
- Tampilan: `src/app/globals.css`; token warna ada di bagian atas.

## 11. Bila ada masalah

| Gejala | Penyebab dan cara memperbaiki |
|---|---|
| Dashboard: “Database belum terhubung” | `DATABASE_URL` kosong atau salah, atau migrasi belum dijalankan. Jalankan `npm run doctor`. |
| Login ditolak (“Akun GitHub ini tidak diizinkan”) | Username GitHub belum ada di `ADMIN_GITHUB_USERS`, atau salah ketik (huruf besar-kecil tidak masalah). |
| Login error setelah deploy | Callback URL di OAuth App masih alamat lokal. Samakan dengan alamat produksi. |
| Perubahan di admin belum terlihat | Tekan muat ulang keras di browser. Proyek yang dijadwalkan muncul paling lambat 10 menit setelah jadwalnya. |
| Unggah gambar gagal | `BLOB_READ_WRITE_TOKEN` belum diisi, format bukan gambar yang didukung, atau ukuran lebih dari 4 MB. |
| Situs publik menampilkan data contoh padahal database terisi | Database sedang tidak terjangkau, jadi situs memakai data cadangan. Cek `/api/health`. |
| Pesan buku tamu atau kontak ditolak | Satu perangkat dibatasi tiga pesan per jam. Tunggu satu jam. |

## 12. Batasan yang perlu kamu tahu

- Penyimpanan proyek berjalan beberapa langkah berurutan karena driver Neon HTTP tidak mendukung transaksi interaktif. Bila gagal di tengah, simpan ulang; hasilnya tetap konsisten.
- Halaman publik di-cache dan diperbarui otomatis saat kamu menyimpan di admin. Tanpa itu, paling lambat 10 menit.
- Pembatas laju memakai sidik jari anonim dari IP, jadi beberapa orang di jaringan yang sama bisa saling membatasi.
- Batas gratis Vercel, Neon, dan Blob bisa berubah; periksa halaman resmi mereka.
