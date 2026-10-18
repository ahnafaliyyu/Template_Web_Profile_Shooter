import { del, put } from "@vercel/blob";

const OK = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX = 4 * 1024 * 1024;

/** Unggah gambar ke Vercel Blob. Mengembalikan alamat publik atau pesan galat berbahasa Indonesia. */
export async function uploadImage(file: FormDataEntryValue | null, folder: string): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || !file.size) return { error: "Pilih berkas gambar dulu." };
  if (!OK.includes(file.type)) return { error: "Format harus PNG, JPEG, WebP, atau AVIF." };
  if (file.size > MAX) return { error: "Ukuran gambar maksimal 4 MB." };
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { error: "BLOB_READ_WRITE_TOKEN belum diatur (lihat PANDUAN.md)." };
  try {
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
    const blob = await put(`${folder}/${Date.now()}-${safe}`, file, { access: "public" });
    return { url: blob.url };
  } catch {
    return { error: "Gagal mengunggah. Coba lagi." };
  }
}

export const deleteImage = (url: string) => del(url).catch(() => {}); // gagal hapus berkas tidak menggagalkan aksi
