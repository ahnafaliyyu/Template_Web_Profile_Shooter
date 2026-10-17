import { getProfile } from "@/server/modules/profile/service";

export const revalidate = 3600;
export const metadata = { title: "Contact" };

export default async function Contact() {
  const p = await getProfile();
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />Dispatch // Kontak</p>
      <h1>Let’s build something sharper.</h1>
      <div className="cp">
        {p.email && <div className="rw"><span className="mu">Email</span><a href={`mailto:${p.email}`} data-t>{p.email}</a></div>}
        {p.location && <div className="rw"><span className="mu">Lokasi</span><span>{p.location}</span></div>}
        <div className="cb">
          {p.email && <a className="btn" href={`mailto:${p.email}`} data-t>Kirim email ↗</a>}
          {p.links.map((l) => <a key={l.url} className="btn o" href={l.url} data-t rel="noopener noreferrer">{l.label}</a>)}
        </div>
      </div>
    </section>
  );
}
