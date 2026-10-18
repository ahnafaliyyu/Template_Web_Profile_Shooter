// Pemeriksa pengaturan: npm run doctor
import { neon } from "@neondatabase/serverless";

let fail = false;
const ok = (m: string) => console.log(`✓ ${m}`);
const bad = (m: string) => { console.log(`✗ ${m}`); fail = true; };
const warn = (m: string) => console.log(`• ${m}`);

async function main() {
  console.log("Memeriksa pengaturan portofolio...\n");
  const need = ["DATABASE_URL", "AUTH_SECRET", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET", "ADMIN_GITHUB_USERS"];
  for (const k of need) process.env[k] ? ok(`${k} terisi`) : bad(`${k} belum diisi (lihat .env.example dan PANDUAN.md)`);
  process.env.BLOB_READ_WRITE_TOKEN ? ok("BLOB_READ_WRITE_TOKEN terisi (unggah gambar siap)") : warn("BLOB_READ_WRITE_TOKEN kosong: unggah gambar belum bisa dipakai (opsional)");

  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      await sql`select 1`;
      ok("Terhubung ke database");
      const [r] = await sql`select to_regclass('public.projects') as t`;
      r?.t ? ok("Tabel sudah ada (migrasi sudah dijalankan)") : bad("Tabel belum ada: jalankan npm run db:migrate");
    } catch (e) {
      bad(`Tidak bisa terhubung ke database: ${(e as Error).message}`);
    }
  }
  console.log(fail ? "\nAda yang perlu diperbaiki di atas." : "\nSemua siap.");
  process.exit(fail ? 1 : 0);
}
main();
