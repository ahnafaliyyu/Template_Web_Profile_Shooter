# Portofolio Ahnaf

Next.js (App Router) + TypeScript + PostgreSQL (Neon) + Drizzle ORM. Desain mengikuti Figma "Technical Dossier".

## Menjalankan

```bash
npm install
cp .env.example .env.local      # isi DATABASE_URL (opsional untuk percobaan lokal)
npm run dev
```

Tanpa `DATABASE_URL`, situs memakai data cadangan di `src/server/db/sample.ts`.

## Database

```bash
npm run db:generate   # buat berkas migrasi dari skema
npm run db:migrate    # terapkan ke database
npm run db:seed       # isi data contoh
```

## Struktur

- `src/app/(site)` halaman publik; bingkai tetap ada di `components/Shell.tsx`
- `src/server/db` skema, klien, data contoh, seed
- `src/server/modules/<modul>` pola `types · repo · service` (repo satu-satunya yang menyentuh database)
- `src/components` Shell, Cursor (kotak → bidikan), Loader
- `src/app/api/health` untuk pemantau uptime

## Belum ada (tahap berikutnya)

Admin dan dashboard, login, modul profil/skill/kredensial/buku tamu, tabel navigasi/media/pesan/riwayat versi, i18n berbasis rute, tujuh halaman lengkap sesuai Figma.
