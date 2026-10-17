# Portofolio Ahnaf

Next.js (App Router) + TypeScript + PostgreSQL (Neon) + Drizzle ORM + Auth.js. Desain mengikuti Figma "Technical Dossier".

## Menjalankan

```bash
npm install
cp .env.example .env.local      # isi sesuai komentar di dalamnya
npm run dev
```

Tanpa `DATABASE_URL`, situs publik tetap jalan memakai data cadangan di `src/server/db/sample.ts`.

## Database

```bash
npm run db:migrate    # terapkan migrasi di folder drizzle/
npm run db:seed       # isi proyek contoh (opsional)
npm run db:generate   # buat migrasi baru setelah mengubah schema.ts
```

## Admin dan dashboard

Buka `/admin`. Login lewat GitHub; hanya username di `ADMIN_GITHUB_USERS` yang diterima.

1. Di GitHub: Settings → Developer settings → OAuth Apps → New. Callback URL: `{alamat-situs}/api/auth/callback/github`
2. Isi `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET` (`npx auth secret`), `ADMIN_GITHUB_USERS`.

Yang bisa dikelola: profil dan status ketersediaan (termasuk kalimat yang berganti di Home), proyek (draf, terbit, unggulan, urutan, dua bahasa), skill, kredensial, moderasi buku tamu. Setiap simpan langsung memperbarui halaman publik tanpa deploy ulang. Semua perubahan tercatat di audit log dan tampil di dashboard.

## Struktur

- `src/app/(site)` halaman publik; bingkai tetap ada di `components/Shell.tsx`
- `src/app/admin` login + panel (dilindungi di layout DAN di setiap server action lewat `lib/guard.ts`)
- `src/server/db` skema, klien, data contoh, seed
- `src/server/modules/<modul>` pola `repo · service · actions`; hanya repo yang menyentuh database
- `src/components` Shell, Cursor, Loader, HeroReticle, RoleSwap, GuestbookForm
- `src/app/api/health` untuk pemantau uptime

## Deploy (Vercel)

Hubungkan repo GitHub ke Vercel, isi variabel lingkungan yang sama, jalankan `npm run db:migrate` sekali terhadap database produksi. Pasang pemantau uptime (mis. UptimeRobot) pada `/api/health`.

## Belum ada

Halaman versi Inggris berbasis rute (`/en`), unggah media, riwayat versi dan jadwal terbit, statistik kunjungan, tabel navigasi/pesan masuk/statistik manual (skemanya sebagian sudah ada), backup terjadwal, pengecekan deploy di dashboard.
