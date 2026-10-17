import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Wajib dipanggil di setiap halaman admin DAN setiap server action admin. */
export async function requireAdmin() {
  const s = await auth();
  if (!s?.login) redirect("/admin/login");
  return { login: s.login };
}
