import { pick, type Locale } from "@/lib/i18n";
import type { L } from "../../db/schema";
import * as repo from "./repo";

export type SettingsRaw = { footerLeft: L; footerRight: L; locChip: string; dispatchTitle: L };
export type SettingsView = { footerLeft: string; footerRight: string; locChip: string; dispatchTitle: string };

export const DEFAULTS: SettingsRaw = {
  footerLeft: { id: "Mahasiswa Informatika / IoT · ML", en: "Informatics student / IoT · ML" },
  footerRight: { id: "Arsip // ID-2026", en: "Archive // ID-2026" },
  locChip: "SYS.LOC // ID",
  dispatchTitle: { id: "Punya ide atau proyek? Mari bicara.", en: "Got an idea or a project? Let’s talk." },
};

export async function getSettingsRaw(): Promise<SettingsRaw> {
  try {
    const s = await repo.getAll();
    return { ...DEFAULTS, ...(s as Partial<SettingsRaw>) };
  } catch (e) {
    console.error("[settings] database tidak tersedia, memakai bawaan:", (e as Error).message);
    return DEFAULTS;
  }
}

export async function getSettings(locale: Locale): Promise<SettingsView> {
  const s = await getSettingsRaw();
  return { footerLeft: pick(s.footerLeft, locale), footerRight: pick(s.footerRight, locale), locChip: s.locChip, dispatchTitle: pick(s.dispatchTitle, locale) };
}
