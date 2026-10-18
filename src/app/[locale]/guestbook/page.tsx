import GuestbookForm from "@/components/GuestbookForm";
import { f } from "@/lib/fmt";
import { getDict } from "@/lib/dict";
import { getLocale, titleOf } from "@/lib/params";
import { listApprovedEntries } from "@/server/modules/guestbook/service";

export const revalidate = 60;
export const generateMetadata = titleOf("nGuest");

export default async function Guestbook({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const entries = await listApprovedEntries();
  const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { dateStyle: "medium" });
  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.guestOv}</p>
        <h1>{d.guestTitle}</h1>
        <div className="chs"><span className="chip">{f(d.nMsgs, entries.length)}</span></div>
      </header>
      <div className="pb" style={{ "--cols": "360px minmax(0,1fr) 260px" } as React.CSSProperties}>
        <section className="pn">
          <div className="pt"><span>{d.writeMsg}</span></div>
          <GuestbookForm d={d} />
          <p className="mu pin" style={{ fontSize: ".95rem" }}>{d.modNote}</p>
        </section>
        <section className="pn">
          <div className="pt"><span>{d.messages}</span><span>{String(entries.length).padStart(2, "0")}</span></div>
          <div className="msgs">
            {!entries.length && <p className="mu">{d.noMsgs}</p>}
            {entries.map((e, i) => <div className="rw" key={i}><span className="mu">{fmt.format(e.createdAt)}</span><div><b>{e.name}</b><p>{e.message}</p></div></div>)}
          </div>
        </section>
        <aside className="pn">
          <div className="mm"><div><b>{String(entries.length).padStart(2, "0")}</b><small>{d.total}</small></div><div><b>{entries[0] ? new Date(entries[0].createdAt).getFullYear() : "—"}</b><small>{d.latest}</small></div></div>
        </aside>
      </div>
      <div className="pbar"><span>{d.messages} <b>{entries.length}</b></span><span>{d.modNote}</span></div>
    </div>
  );
}
