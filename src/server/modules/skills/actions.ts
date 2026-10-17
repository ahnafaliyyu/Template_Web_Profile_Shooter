"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import * as audit from "../audit/repo";
import * as repo from "./repo";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  group: z.string().trim().min(1).max(80),
  level: z.union([z.literal(""), z.coerce.number().int().min(1).max(5)]),
});

export async function addSkill(fd: FormData) {
  const { login } = await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect(`/admin/skills?err=${encodeURIComponent("Nama dan kelompok wajib diisi; tingkat 1 sampai 5.")}`);
  await repo.create({ name: p.data.name, group: p.data.group, level: p.data.level === "" ? null : p.data.level, featured: fd.get("featured") === "on" });
  await audit.log(login, "tambah", "skill", p.data.name);
  revalidateSite();
  redirect("/admin/skills");
}

export async function toggleSkillFeatured(id: number, featured: boolean) {
  const { login } = await requireAdmin();
  await repo.setFeatured(id, featured);
  await audit.log(login, featured ? "unggulkan" : "lepas unggulan", "skill", id);
  revalidateSite();
  redirect("/admin/skills");
}

export async function deleteSkill(id: number) {
  const { login } = await requireAdmin();
  await repo.remove(id);
  await audit.log(login, "hapus", "skill", id);
  revalidateSite();
  redirect("/admin/skills");
}
