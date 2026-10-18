# Portofolio Ahnaf

Next.js (App Router) + TypeScript + PostgreSQL (Neon) + Drizzle ORM + Auth.js. Desain mengikuti Figma "Technical Dossier". Dua bahasa (`/id`, `/en`).

**Mulai di sini:** baca [`PANDUAN.md`](./PANDUAN.md) untuk langkah lengkap: database, login admin, unggah gambar, deploy, pemakaian harian, cadangan, dan pemecahan masalah.

## Ringkas

```bash
npm install
cp .env.example .env.local
npm run dev          # situs jalan dengan data contoh tanpa database
npm run doctor       # memeriksa pengaturan
npm run db:migrate   # buat tabel
npm run db:seed      # isi data contoh
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` / `build` / `start` | jalankan, bangun, sajikan |
| `npm run check` | cek tipe TypeScript |
| `npm run doctor` | periksa env dan database |
| `npm run db:generate` | buat migrasi dari `schema.ts` |
| `npm run db:migrate` | terapkan migrasi |
| `npm run db:seed` | isi data contoh |
| `npm run db:restore -- berkas.json` | pulihkan cadangan |

## Struktur

- `src/app/[locale]` halaman publik; bingkai tetap di `components/Shell.tsx`
- `src/app/admin` login dan panel (dijaga di layout dan di setiap aksi lewat `lib/guard.ts`)
- `src/server/db` skema, klien, data contoh, seed
- `src/server/modules/<modul>` pola `repo · service · actions`
- `src/lib/dict.ts` seluruh teks tetap dua bahasa
- `scripts/` doctor dan restore
