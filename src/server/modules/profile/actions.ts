"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import * as audit from "../audit/repo";
import { uploadImage, deleteImage } from "@/lib/upload";
import * as revisions from "../revisions/repo";
import * as repo from "./repo";
import { getProfileRaw } from "./service";

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const schema = z.object({
  name: z.string().trim().min(1).max(80),
  role_id: z.string().trim().min(1).max(160), role_en: z.string().trim().max(160),
  bio_id: z.string().trim().min(1).max(2000), bio_en: z.string().trim().max(2000),
  availability_id: z.string().trim().max(160), availability_en: z.string().trim().max(160),
  focus_id: z.string().trim().max(160), focus_en: z.string().trim().max(160),
  email: z.string().trim().max(160), location: z.string().trim().max(120),
  tags: z.string().max(400), links: z.string().max(800),
});
const L = (id: string, en: string) => ({ id, ...(en ? { en } : {}) });

export async function saveProfileAction(fd: FormData) {
  const { login } = await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect(`/admin/profile?err=${encodeURIComponent("Isian belum lengkap atau terlalu panjang.")}`);
  const v = p.data;
  const prev = await repo.get().catch(() => null);
  if (prev) await revisions.add("profile", 1, { name: prev.name, role: prev.role, bio: prev.bio, availability: prev.availability, focus: prev.focus, extra: prev.extra }, login);
  await repo.save({
    name: v.name,
    role: L(v.role_id, v.role_en),
    bio: L(v.bio_id, v.bio_en),
    availability: v.availability_id ? L(v.availability_id, v.availability_en) : null,
    focus: v.focus_id ? L(v.focus_id, v.focus_en) : null,
    extra: {
      email: v.email || undefined,
      location: v.location || undefined,
      tags: lines(v.tags),
      photo: prev?.extra?.photo,
      links: lines(v.links).map((l) => { const [label, ...u] = l.split("|"); return { label: label.trim(), url: u.join("|").trim() }; }).filter((l) => l.label && l.url),
    },
  });
  await audit.log(login, "ubah", "profil");
  revalidateSite();
  redirect("/admin/profile?ok=1");
}

export async function uploadProfilePhoto(fd: FormData) {
  const { login } = await requireAdmin();
  const r = await uploadImage(fd.get("file"), "profile");
  if ("error" in r) redirect(`/admin/profile?err=${encodeURIComponent(r.error)}`);
  const cur = await getProfileRaw();
  if (cur.extra?.photo) await deleteImage(cur.extra.photo);
  await repo.save({ name: cur.name, role: cur.role, bio: cur.bio, availability: cur.availability, focus: cur.focus, extra: { ...cur.extra, photo: r.url } });
  await audit.log(login, "ganti foto", "profil");
  revalidateSite();
  redirect("/admin/profile?ok=1");
}

export async function restoreProfile(revisionId: number) {
  const { login } = await requireAdmin();
  const rev = await revisions.get(revisionId);
  if (!rev || rev.entity !== "profile") redirect(`/admin/profile?err=${encodeURIComponent("Versi tidak ditemukan.")}`);
  const cur = await repo.get().catch(() => null);
  if (cur) await revisions.add("profile", 1, { name: cur.name, role: cur.role, bio: cur.bio, availability: cur.availability, focus: cur.focus, extra: cur.extra }, login);
  await repo.save(rev.snapshot as repo.ProfileInput);
  await audit.log(login, "pulihkan versi", "profil");
  revalidateSite();
  redirect("/admin/profile?ok=1");
}
