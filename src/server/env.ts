import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
  // Daftar username GitHub yang boleh masuk admin, dipisah koma.
  ADMIN_GITHUB_USERS: z
    .string()
    .default("")
    .transform((s) => s.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean)),
});

// Divalidasi saat modul pertama kali dimuat: salah isi = gagal jelas, bukan error diam-diam.
export const env = schema.parse({
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  ADMIN_GITHUB_USERS: process.env.ADMIN_GITHUB_USERS,
});
