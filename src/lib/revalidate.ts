import { revalidatePath } from "next/cache";

/** Setelah admin menyimpan, semua halaman publik diperbarui seketika tanpa deploy ulang. */
export const revalidateSite = () => revalidatePath("/", "layout");
