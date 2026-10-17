import { pick, type Locale } from "@/lib/i18n";
import { sampleProfile } from "../../db/sample";
import * as repo from "./repo";

export type ProfileView = {
  name: string; role: string; bio: string; availability: string; focus: string;
  email: string; location: string; tags: string[]; links: { label: string; url: string }[];
};

const toView = (p: typeof sampleProfile | NonNullable<Awaited<ReturnType<typeof repo.get>>>, locale: Locale): ProfileView => ({
  name: p.name,
  role: pick(p.role, locale),
  bio: pick(p.bio, locale),
  availability: pick(p.availability, locale),
  focus: pick(p.focus, locale),
  email: p.extra?.email ?? "",
  location: p.extra?.location ?? "",
  tags: p.extra?.tags ?? [],
  links: p.extra?.links ?? [],
});

export async function getProfile(locale: Locale = "id"): Promise<ProfileView> {
  try {
    const row = await repo.get();
    if (row) return toView(row, locale);
  } catch (e) {
    console.error("[profile] database tidak tersedia, memakai data cadangan:", (e as Error).message);
  }
  return toView(sampleProfile, locale);
}

/** Untuk form admin: nilai mentah dua bahasa. */
export const getProfileRaw = async () => (await repo.get().catch(() => null)) ?? { ...sampleProfile, updatedAt: null as Date | null };
