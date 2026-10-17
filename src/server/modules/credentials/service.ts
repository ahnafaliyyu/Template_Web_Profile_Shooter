import { pick, type Locale } from "@/lib/i18n";
import { sampleCredentials } from "../../db/sample";
import * as repo from "./repo";

export type Kind = repo.CredInput["kind"];
export type CredView = { kind: Kind; title: string; issuer: string; year: number | null; url: string };
export const KIND_LABEL: Record<Kind, string> = { pendidikan: "Pendidikan", sertifikat: "Sertifikat", publikasi: "Publikasi", penghargaan: "Penghargaan" };

export async function listCredentials(locale: Locale = "id"): Promise<CredView[]> {
  try {
    const rows = await repo.list();
    if (rows.length) return rows.filter((r) => r.published).map((r) => ({ kind: r.kind, title: pick(r.title, locale), issuer: r.issuer ?? "", year: r.year, url: r.url ?? "" }));
  } catch (e) {
    console.error("[credentials] database tidak tersedia, memakai data cadangan:", (e as Error).message);
  }
  return sampleCredentials.map((r) => ({ kind: r.kind, title: pick(r.title, locale), issuer: r.issuer ?? "", year: r.year, url: r.url ?? "" }));
}
