import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/client";
import * as analytics from "@/server/modules/analytics/repo";

const BOT = /bot|crawl|spider|preview|headless|lighthouse|monitor|uptime/i;

/** Hitungan kunjungan harian. Tidak ada cookie, tidak ada IP; yang disimpan hanya jalur, negara, dan jumlah. */
export async function POST(req: NextRequest) {
  const quiet = new NextResponse(null, { status: 204 });
  if (!db || BOT.test(req.headers.get("user-agent") ?? "")) return quiet;
  try {
    const { path } = (await req.json()) as { path?: unknown };
    if (typeof path !== "string" || !/^\/(id|en)(\/[\w\-./]*)?$/.test(path) || path.length > 200) return quiet;
    const c = (req.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
    await analytics.hit(new Date().toISOString().slice(0, 10), path.replace(/\/$/, "") || "/", /^[A-Z]{2}$/.test(c) ? c : "??");
  } catch {
    /* statistik tidak boleh mengganggu pengunjung */
  }
  return quiet;
}
