import { createHash } from "node:crypto";
import { headers } from "next/headers";

/** Sidik jari anonim untuk pembatas laju. IP mentah tidak pernah disimpan. */
export async function clientHash() {
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  return createHash("sha256").update(ip + (process.env.AUTH_SECRET ?? "")).digest("hex").slice(0, 32);
}
