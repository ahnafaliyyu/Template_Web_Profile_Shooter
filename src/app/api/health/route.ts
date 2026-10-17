import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db/client";

export const dynamic = "force-dynamic";

/** Dipakai pemantau uptime. "degraded" = situs tetap tayang dari cache, tetapi database bermasalah. */
export async function GET() {
  const t0 = Date.now();
  let database: "up" | "down" | "unconfigured" = "unconfigured";
  if (db) {
    try { await db.execute(sql`select 1`); database = "up"; } catch { database = "down"; }
  }
  return NextResponse.json({
    status: database === "down" ? "degraded" : "ok",
    database,
    latencyMs: Date.now() - t0,
    time: new Date().toISOString(),
  });
}
