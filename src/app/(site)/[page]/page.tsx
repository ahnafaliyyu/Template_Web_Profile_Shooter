import { notFound } from "next/navigation";

const PAGES: Record<string, { ov: string; h: string }> = {
  about: { ov: "Dossier // Tentang", h: "About." },
  skills: { ov: "Arsenal // Skill", h: "Skills." },
  credentials: { ov: "Arsip // Kredensial", h: "Credentials." },
  guestbook: { ov: "Log // Buku tamu", h: "Guestbook." },
  contact: { ov: "Dispatch // Kontak", h: "Contact." },
};

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PAGES).map((page) => ({ page }));

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = PAGES[page];
  if (!p) notFound();
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />{p.ov}</p>
      <h1>{p.h}</h1>
      <p className="lead mu">Halaman ini mengikuti frame Figma dan dibangun pada tahap berikutnya.</p>
    </section>
  );
}
