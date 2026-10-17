import * as repo from "./repo";

export type GbEntry = { name: string; message: string; createdAt: Date };

export async function listApprovedEntries(): Promise<GbEntry[]> {
  try {
    return await repo.listApproved();
  } catch (e) {
    console.error("[guestbook] database tidak tersedia:", (e as Error).message);
    return []; // gagal dengan sopan: halaman tetap tampil
  }
}
