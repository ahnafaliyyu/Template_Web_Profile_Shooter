"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import * as audit from "../audit/repo";
import * as repo from "./repo";

const schema = z.object({
  kind: z.enum(["pendidikan", "sertifikat", "publikasi", "penghargaan"]),
  title_id: z.string().trim().min(1).max(240), title_en: z.string().trim().max(240),
  desc_id: z.string().trim().max(800), desc_en: z.string().trim().max(800),
  issuer: z.string().trim().max(160), year: z.union([z.literal(""), z.coerce.number().int().min(1990).max(2100)]),
  url: z.string().trim().max(400),
});

export async function addCredential(fd: FormData) {
  const { login } = await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect(`/admin/credentials?err=${encodeURIComponent("Jenis dan judul wajib diisi; tahun harus angka yang wajar.")}`);
  const v = p.data;
  await repo.create({
    kind: v.kind, title: { id: v.title_id, ...(v.title_en ? { en: v.title_en } : {}) },
    description: v.desc_id ? { id: v.desc_id, ...(v.desc_en ? { en: v.desc_en } : {}) } : null,
    issuer: v.issuer || null, year: v.year === "" ? null : v.year, url: v.url || null, published: fd.get("published") === "on",
  });
  await audit.log(login, "tambah", "kredensial", v.title_id);
  revalidateSite();
  redirect("/admin/credentials");
}

export async function toggleCredential(id: number, published: boolean) {
  const { login } = await requireAdmin();
  await repo.setPublished(id, published);
  await audit.log(login, published ? "terbitkan" : "sembunyikan", "kredensial", id);
  revalidateSite();
  redirect("/admin/credentials");
}

export async function deleteCredential(id: number) {
  const { login } = await requireAdmin();
  await repo.remove(id);
  await audit.log(login, "hapus", "kredensial", id);
  revalidateSite();
  redirect("/admin/credentials");
}
