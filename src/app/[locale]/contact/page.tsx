import ContactForm from "@/components/ContactForm";
import { getDict } from "@/lib/dict";
import { getLocale, titleOf } from "@/lib/params";
import { getProfile } from "@/server/modules/profile/service";

export const revalidate = 600;
export const generateMetadata = titleOf("nContact");

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const p = await getProfile(locale);
  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.contactOv}</p>
        <h1 style={{ fontSize: "clamp(2.2rem,5.2vw,4.4rem)" }}>{d.contactTitle}</h1>
        <div className="chs">{p.availability && <span className="chip"><i />{p.availability}</span>}</div>
      </header>
      <div className="pb" style={{ "--cols": "minmax(0,1.5fr) minmax(0,1fr)" } as React.CSSProperties}>
        <section className="pn">
          <div className="pt"><span>{d.writeToMe}</span></div>
          <ContactForm d={d} />
        </section>
        <aside className="pn">
          <div className="pt"><span>{d.directChannels}</span></div>
          <dl className="kv">
            {p.email && <><dt>{d.kEmail}</dt><dd><a href={`mailto:${p.email}`} data-t>{p.email}</a></dd></>}
            {p.location && <><dt>{d.kLoc}</dt><dd>{p.location}</dd></>}
            {p.availability && <><dt>{d.statusL}</dt><dd>{p.availability}</dd></>}
          </dl>
          <div>{p.links.map((l) => <a key={l.url} className="lnk" href={l.url} data-t rel="noopener noreferrer"><span>{l.label}</span><span>↗</span></a>)}</div>
          {p.email && <a className="btn pin" href={`mailto:${p.email}`} data-t style={{ justifySelf: "start" }}>{d.sendMail}</a>}
        </aside>
      </div>
      <div className="pbar"><span>{d.kEmail} <b>{p.email || "—"}</b></span>{p.location && <span>{d.kLoc} <b>{p.location}</b></span>}</div>
    </div>
  );
}
