import { KIND_LABEL, listCredentials, type Kind } from "@/server/modules/credentials/service";

export const revalidate = 3600;
export const metadata = { title: "Credentials" };

export default async function Credentials() {
  const items = await listCredentials();
  const kinds = (Object.keys(KIND_LABEL) as Kind[]).filter((k) => items.some((i) => i.kind === k));
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />Arsip // Kredensial</p>
      <h1>Credentials.</h1>
      {!kinds.length && <p className="mu">Belum ada kredensial yang diterbitkan.</p>}
      {kinds.map((k) => (
        <div key={k}>
          <div className="sh"><span>{KIND_LABEL[k]}</span></div>
          {items.filter((i) => i.kind === k).map((c) => (
            <div className="rw" key={c.title}>
              <span className="mu">{c.year ?? "—"}</span>
              <div>
                {c.url ? <a href={c.url} data-t rel="noopener noreferrer"><b>{c.title}</b> ↗</a> : <b>{c.title}</b>}
                {c.issuer && <><br /><span className="mu">{c.issuer}</span></>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
