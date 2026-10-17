"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import * as audit from "../audit/repo";
import * as repo from "./repo";

const schema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung.").max(120),
  title_id: z.string().trim().min(1, "Judul wajib diisi.").max(160), title_en: z.string().trim().max(160),
  summary_id: z.string().trim().min(1, "Ringkasan wajib diisi.").max(800), summary_en: z.string().trim().max(800),
  note_id: z.string().trim().max(400), note_en: z.string().trim().max(400),
  kind: z.string().trim().min(1, "Jenis wajib diisi.").max(60),
  year: z.coerce.number().int().min(2000).max(2100),
  status: z.enum(["aktif", "selesai", "konsep"]),
  access: z.enum(["publik", "privat"]),
  progress: z.coerce.number().int().min(0).max(100),
  framework: z.string().trim().max(160),
  stack: z.string().max(400),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});
const L = (id: string, en: string) => ({ id, ...(en ? { en } : {}) });

export async function saveProject(id: number | null, fd: FormData) {
  const { login } = await requireAdmin();
  const back = id ? `/admin/projects/${id}` : "/admin/projects/new";
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect(`${back}?err=${encodeURIComponent(p.error.issues[0]?.message ?? "Isian tidak valid.")}`);
  const v = p.data;
  let pid: number;
  try {
    pid = await repo.save(id, {
      slug: v.slug, title: L(v.title_id, v.title_en), summary: L(v.summary_id, v.summary_en),
      note: v.note_id ? L(v.note_id, v.note_en) : null, kind: v.kind, year: v.year, status: v.status, access: v.access,
      progress: v.progress, framework: v.framework || null, featured: fd.get("featured") === "on",
      stack: v.stack.split(",").map((x) => x.trim()).filter(Boolean), published: fd.get("published") === "on", sortOrder: v.sortOrder,
    });
  } catch {
    redirect(`${back}?err=${encodeURIComponent("Gagal menyimpan. Slug mungkin sudah dipakai proyek lain.")}`);
  }
  await audit.log(login, id ? "ubah" : "tambah", "proyek", pid);
  revalidateSite();
  redirect(`/admin/projects/${pid}?ok=1`);
}

export async function togglePublished(id: number, published: boolean) {
  const { login } = await requireAdmin();
  await repo.setPublished(id, published);
  await audit.log(login, published ? "terbitkan" : "tarik dari terbit", "proyek", id);
  revalidateSite();
  redirect("/admin/projects");
}

export async function deleteProject(id: number) {
  const { login } = await requireAdmin();
  await repo.remove(id);
  await audit.log(login, "hapus", "proyek", id);
  revalidateSite();
  redirect("/admin/projects");
}
