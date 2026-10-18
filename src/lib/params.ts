import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, type StrKey } from "./dict";
import { isLocale, type Locale } from "./i18n";

type P = { params: Promise<{ locale: string }> };

export async function getLocale(params: P["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/** generateMetadata untuk halaman biasa: judul diambil dari kamus sesuai bahasa. */
export const titleOf = (key: StrKey) => async ({ params }: P): Promise<Metadata> => ({ title: getDict(await getLocale(params))[key] });
