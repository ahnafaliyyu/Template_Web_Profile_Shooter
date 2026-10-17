import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
});

// Divalidasi saat modul pertama kali dimuat: salah isi = gagal jelas, bukan error diam-diam.
export const env = schema.parse({
  DATABASE_URL: process.env.DATABASE_URL || undefined,
});
