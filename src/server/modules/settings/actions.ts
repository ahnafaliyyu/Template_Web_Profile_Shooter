"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/guard";
import { revalidateSite } from "@/lib/revalidate";
import * as audit from "../audit/repo";
import * as repo from "./repo";

const schema = z.object({
  footerLeft_id: z.string().trim().min(1).max(120), footerLeft_en: z.string().trim().max(120),
  footerRight_id: z.string().trim().min(1).max(120), footerRight_en: z.string().trim().max(120),
  locChip: z.string().trim().min(1).max(40),
  dispatch_id: z.string().trim().min(1).max(160), dispatch_en: z.string().trim().max(160),
});
const L = (id: string, en: string) => ({ id, ...(en ? { en } : {}) });

export async function saveSettings(fd: FormData) {
  const { login } = await requireAdmin();
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) redirect(`/admin/settings?err=${encodeURIComponent("Isian belum lengkap atau terlalu panjang.")}`);
  const v = p.data;
  await repo.setMany({
    footerLeft: L(v.footerLeft_id, v.footerLeft_en), footerRight: L(v.footerRight_id, v.footerRight_en),
    locChip: v.locChip, dispatchTitle: L(v.dispatch_id, v.dispatch_en),
  });
  await audit.log(login, "ubah", "tampilan situs");
  revalidateSite();
  redirect("/admin/settings?ok=1");
}
