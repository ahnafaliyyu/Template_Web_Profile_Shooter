import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env";
import * as schema from "./schema";

/** null bila DATABASE_URL belum diatur; pemanggil wajib punya jalur cadangan. */
export const db = env.DATABASE_URL ? drizzle(neon(env.DATABASE_URL), { schema }) : null;

export function requireDb() {
  if (!db) throw new Error("DATABASE_URL belum diatur");
  return db;
}
