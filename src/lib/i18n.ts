import type { L } from "@/server/db/schema";

export type Locale = "id" | "en";

/** Ambil teks sesuai bahasa; jatuh ke Indonesia bila terjemahan belum diisi. */
export const pick = (text: L | null | undefined, locale: Locale = "id") =>
  text ? (text[locale] || text.id) : "";
