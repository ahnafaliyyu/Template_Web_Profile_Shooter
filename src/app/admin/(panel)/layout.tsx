import Link from "next/link";
import { signOut } from "@/auth";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

const NAV: [string, string][] = [
  ["/admin", "Ringkasan"], ["/admin/profile", "Profil dan status"], ["/admin/projects", "Proyek"],
  ["/admin/skills", "Skill"], ["/admin/credentials", "Kredensial"], ["/admin/guestbook", "Buku tamu"],
];

export default async function Panel({ children }: { children: React.ReactNode }) {
  const { login } = await requireAdmin();
  return (
    <div className="am">
      <aside className="as">
        <div className="tt">Admin<b>A. Ahnaf / 2026</b></div>
        {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        <div className="ft">
          <Link href="/" style={{ padding: 0 }}>← Lihat situs</Link>
          <span>@{login}</span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="btn o s">Keluar</button></form>
        </div>
      </aside>
      <main className="ac">{children}</main>
    </div>
  );
}
