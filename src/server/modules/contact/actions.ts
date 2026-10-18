"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clientHash } from "@/lib/ip";
import { requireAdmin } from "@/lib/guard";
import { db } from "../../db/client";
import * as audit from "../audit/repo";
import type { GbState } from "../guestbook/actions";
import * as repo from "./repo";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0),
});

/** Publik: pesan masuk ke kotak masuk admin. Honeypot dan batas tiga pesan per jam per perangkat. */
export async function sendContact(_prev: GbState, fd: FormData): Promise<GbState> {
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) {
    const k = p.error.issues[0]?.path[0];
    return { error: k === "name" ? "name" : k === "email" ? "email" : k === "subject" ? "subject" : k === "message" ? "short" : "bad" };
  }
  if (!db) return { error: "down" };
  try {
    const ipHash = await clientHash();
    if ((await repo.countRecent(ipHash, new Date(Date.now() - 3600_000))) >= 3) return { error: "rate" };
    const { website: _h, ...v } = p.data;
    await repo.create({ ...v, ipHash });
  } catch {
    return { error: "down" };
  }
  return { ok: true };
}

export async function setContactStatus(id: number, status: "baru" | "dibalas" | "arsip") {
  const { login } = await requireAdmin();
  await repo.setStatus(id, status);
  await audit.log(login, `tandai ${status}`, "pesan masuk", id);
  redirect("/admin/messages");
}

export async function deleteContact(id: number) {
  const { login } = await requireAdmin();
  await repo.remove(id);
  await audit.log(login, "hapus", "pesan masuk", id);
  redirect("/admin/messages");
}
