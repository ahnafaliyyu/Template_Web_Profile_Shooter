import { listCredentials } from "@/server/modules/credentials/service";
import { getProfile } from "@/server/modules/profile/service";

export const revalidate = 3600;
export const metadata = { title: "About" };

export default async function About() {
  const [p, creds] = await Promise.all([getProfile(), listCredentials()]);
  const edu = creds.filter((c) => c.kind === "pendidikan");
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />Dossier // Tentang</p>
      <h1>About.</h1>
      <div className="ab">
        <p className="lead">{p.role}. {p.focus && `Fokus: ${p.focus}.`}</p>
        <p>{p.bio}</p>
        {edu.length > 0 && (
          <>
            <div className="sh"><span>Pendidikan</span></div>
            {edu.map((e) => <div className="rw" key={e.title}><span className="mu">{e.year ?? "—"}</span><div><b>{e.title}</b><br /><span className="mu">{e.issuer}</span></div></div>)}
          </>
        )}
      </div>
    </section>
  );
}
