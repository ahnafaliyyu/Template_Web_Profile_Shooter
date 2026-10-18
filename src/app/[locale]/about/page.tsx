import Link from "next/link";
import { f } from "@/lib/fmt";
import { getDict } from "@/lib/dict";
import { href } from "@/lib/i18n";
import { getLocale, titleOf } from "@/lib/params";
import { listCredentials } from "@/server/modules/credentials/service";
import { getProfile } from "@/server/modules/profile/service";
import { listProjects } from "@/server/modules/projects/service";

export const revalidate = 600;
export const generateMetadata = titleOf("nAbout");

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const [p, projects, creds] = await Promise.all([getProfile(locale), listProjects(locale), listCredentials(locale)]);
  const STATUS = { aktif: d.sAktif, selesai: d.sSelesai, konsep: d.sKonsep } as const;
  const freq = new Map<string, number>();
  for (const x of projects) for (const s of x.stack) freq.set(s, (freq.get(s) ?? 0) + 1);
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const timeline = [
    ...projects.map((x) => ({ y: x.year, t: x.title, s: `${x.kind} · ${STATUS[x.status]}` })),
    ...creds.map((c) => ({ y: c.year, t: c.title, s: c.issuer || "" })),
  ].sort((a, b) => (b.y ?? 0) - (a.y ?? 0)).slice(0, 8);
  const edu = creds.filter((c) => c.kind === "pendidikan");
  const fl = projects.filter((x) => x.featured).slice(0, 3);

  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.aboutOv}</p>
        <h1>{f(d.aboutTitle, p.name)}</h1>
        <div className="chs">{p.availability && <span className="chip">{p.availability}</span>}{p.location && <span className="chip">{p.location}</span>}</div>
      </header>

      <div className="pb" style={{ "--cols": "300px minmax(0,1fr) 320px" } as React.CSSProperties}>
        <aside className="pn">
          <div className="ptr">{p.photo ? <img src={p.photo} alt={p.name} /> : <b aria-hidden="true">{p.name.slice(0, 1)}.</b>}</div>
          <dl className="kv">
            <dt>{d.kName}</dt><dd>{p.name}</dd>
            <dt>{d.kRole}</dt><dd>{p.role}</dd>
            {p.focus && <><dt>{d.kFocus}</dt><dd>{p.focus}</dd></>}
            {p.location && <><dt>{d.kLoc}</dt><dd>{p.location}</dd></>}
            {p.email && <><dt>{d.kEmail}</dt><dd>{p.email}</dd></>}
          </dl>
          {p.links.length > 0 && (
            <div>
              <div className="pt"><span>{d.channels}</span><span>{String(p.links.length).padStart(2, "0")}</span></div>
              {p.links.map((l) => <a key={l.url} className="lnk" href={l.url} data-t rel="noopener noreferrer"><span>{l.label}</span><span>↗</span></a>)}
            </div>
          )}
          <div className="pin"><Link className="btn" href={href(locale, "/contact")} data-t>{d.reach}</Link></div>
        </aside>

        <section className="pn">
          <p className="lead2">{p.bio}</p>
          {p.focus && <div className="cd g"><div className="sl" style={{ marginTop: 0 }}>{d.currentFocus}</div><h3>{p.focus}</h3></div>}
          {fl.length > 0 && (
            <div>
              <div className="pt"><span>{d.featured}</span><Link href={href(locale, "/projects")} data-t>{d.seeAll}</Link></div>
              {fl.map((x) => (
                <Link key={x.slug} className="gi" href={href(locale, `/projects/${x.slug}`)} data-t style={{ marginTop: 8 }}>
                  <b>{x.title}</b><small>{x.summary}</small>
                </Link>
              ))}
            </div>
          )}
          {edu.length > 0 && (
            <div className="pin">
              <div className="pt"><span>{d.education}</span></div>
              {edu.map((e) => <div className="rw" key={e.title}><span className="mu">{e.year ?? "—"}</span><div><b>{e.title}</b><br /><span className="mu">{e.issuer}</span></div></div>)}
            </div>
          )}
        </section>

        <aside className="pn">
          <div className="pt"><span>{d.timeline}</span><span>{String(timeline.length).padStart(2, "0")}</span></div>
          <ul className="tl">
            {timeline.map((t, i) => <li key={i}><span className="mu">{t.y ?? "—"}</span><div><b>{t.t}</b><span className="mu">{t.s}</span></div></li>)}
          </ul>
          <div className="pin">
            <div className="pt" style={{ marginBottom: 10 }}><span>{d.telemetry}</span></div>
            <div className="mm"><div><b>{String(projects.length).padStart(2, "0")}</b><small>{d.mProjects}</small></div><div><b>{String(freq.size).padStart(2, "0")}</b><small>{d.mTech}</small></div></div>
            <div className="sl">{d.topStack}</div>
            <div className="g2">{top.map(([n]) => <span key={n} className="tg">{n}</span>)}</div>
          </div>
        </aside>
      </div>

      <div className="pbar"><span>{d.mProjects} <b>{projects.length}</b></span><span>{d.mTech} <b>{freq.size}</b></span><span>{d.mPubs} <b>{creds.filter((c) => c.kind === "publikasi").length}</b></span>{p.availability && <span><b>{p.availability}</b></span>}</div>
    </div>
  );
}
