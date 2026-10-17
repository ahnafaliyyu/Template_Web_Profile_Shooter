import { sampleSkills } from "../../db/sample";
import * as repo from "./repo";

export type SkillView = { id?: number; name: string; group: string; level: number | null; featured: boolean };

export async function listSkills(): Promise<SkillView[]> {
  try {
    const rows = await repo.list();
    if (rows.length) return rows;
  } catch (e) {
    console.error("[skills] database tidak tersedia, memakai data cadangan:", (e as Error).message);
  }
  return sampleSkills;
}

export const groupSkills = (items: SkillView[]) => {
  const m = new Map<string, SkillView[]>();
  for (const s of items) m.set(s.group, [...(m.get(s.group) ?? []), s]);
  return [...m.entries()];
};
