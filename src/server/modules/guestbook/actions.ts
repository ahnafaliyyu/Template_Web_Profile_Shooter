"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clientHash } from "@/lib/ip";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import { db } from "../../db/client";
import * as audit from "../audit/repo";
import * as repo from "./repo";

export type FormError = "name" | "short" | "long" | "rate" | "down" | "bad" | "email" | "subject";
export type GbState = { ok?: boolean; error?: FormError };

const schema = z.object({
  name: z.string().trim().min(1).max(60),
  message: z.string().trim().min(3).max(500),
  website: z.string().max(0), // honeypot: manusia tidak melihat kolom ini
});

/** Publik: pesan masuk sebagai "pending" dan baru tampil setelah disetujui di admin. */
export async function signGuestbook(_prev: GbState, fd: FormData): Promise<GbState> {
  const p = schema.safeParse({ name: fd.get("name") ?? "", message: fd.get("message") ?? "", website: fd.get("website") ?? "" });
  if (!p.success) {
    const f = p.error.issues[0];
    return { error: f?.path[0] === "name" ? "name" : f?.code === "too_big" ? "long" : f?.path[0] === "message" ? "short" : "bad" };
  }
  if (!db) return { error: "down" };
  try {
    const ipHash = await clientHash();
    if ((await repo.countRecent(ipHash, new Date(Date.now() - 3600_000))) >= 3) return { error: "rate" };
    await repo.create({ name: p.data.name, message: p.data.message, ipHash });
  } catch {
    return { error: "down" };
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
