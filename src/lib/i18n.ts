import type { L } from "@/server/db/schema";

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

/** Ambil teks sesuai bahasa; jatuh ke Indonesia bila terjemahan belum diisi. */
export const pick = (text: L | null | undefined, locale: Locale = "id") =>
  text ? (text[locale] || text.id) : "";

/** Tautan internal selalu berawalan bahasa: href("en", "/projects") → /en/projects */
export const href = (locale: Locale, path = "/") => `/${locale}${path === "/" ? "" : path}`;
