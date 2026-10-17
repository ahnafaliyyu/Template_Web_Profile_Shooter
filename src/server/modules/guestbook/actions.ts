"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import { db } from "../../db/client";
import * as audit from "../audit/repo";
import * as repo from "./repo";

export type GbState = { ok?: boolean; error?: string };

const schema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(60, "Nama terlalu panjang."),
  message: z.string().trim().min(3, "Pesan terlalu pendek.").max(500, "Pesan maksimal 500 karakter."),
  website: z.string().max(0), // honeypot: manusia tidak melihat kolom ini
});

/** Publik: pesan masuk sebagai "pending" dan baru tampil setelah disetujui di admin. */
export async function signGuestbook(_prev: GbState, fd: FormData): Promise<GbState> {
  const p = schema.safeParse({ name: fd.get("name") ?? "", message: fd.get("message") ?? "", website: fd.get("website") ?? "" });
  if (!p.success) return { error: p.error.issues[0]?.message ?? "Isian tidak valid." };
  if (!db) return { error: "Buku tamu sedang istirahat. Coba lagi nanti." };

  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ipHash = createHash("sha256").update(ip + (process.env.AUTH_SECRET ?? "")).digest("hex").slice(0, 32);
  try {
    if ((await repo.countRecent(ipHash, new Date(Date.now() - 3600_000))) >= 3) return { error: "Terlalu banyak pesan dari perangkat ini. Coba lagi satu jam lagi." };
    await repo.create({ name: p.data.name, message: p.data.message, ipHash });
  } catch {
    return { error: "Buku tamu sedang istirahat. Coba lagi nanti." };
  }
  return { ok: true };
}

export async function moderateGuestbook(id: number, status: "approved" | "hidden") {
  const { login } = await requireAdmin();
  await repo.setStatus(id, status);
  await audit.log(login, status === "approved" ? "setujui" : "sembunyikan", "buku tamu", id);
  revalidateSite();
  redirect("/admin/guestbook");
}

export async function deleteGuestbook(id: number) {
  const { login } = await requireAdmin();
  await repo.remove(id);
  await audit.log(login, "hapus", "buku tamu", id);
  revalidateSite();
  redirect("/admin/guestbook");
}
