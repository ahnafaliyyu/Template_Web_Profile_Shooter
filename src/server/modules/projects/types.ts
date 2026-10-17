import type { L } from "@/server/db/schema";

export type Status = "aktif" | "selesai" | "konsep";
export type Access = "publik" | "privat";

/** Bentuk data proyek di lapisan server (sama untuk database dan data cadangan). */
export type ProjectRecord = {
  slug: string;
  year: number;
  kind: string;
  status: Status;
  access: Access;
  progress: number;
  featured: boolean;
  framework: string | null;
  stack: string[];
  title: L;
  summary: L;
  note: L | null;
};

/** Bentuk data yang dikirim ke komponen tampilan (sudah satu bahasa). */
export type ProjectView = {
  slug: string;
  year: number;
  kind: string;
  status: Status;
  access: Access;
  progress: number;
  featured: boolean;
  framework: string;
  stack: string[];
  title: string;
  summary: string;
  note: string;
};
