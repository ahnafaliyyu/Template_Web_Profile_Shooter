"use client";
import { f } from "@/lib/fmt";
import { useState } from "react";
import type { Dict } from "@/lib/dict";
import type { CredView, Kind } from "@/server/modules/credentials/service";

/** Daftar kredensial + rincian + telemetri per jenis. Di layar kecil menjadi dua langkah. */
export default function CredentialBrowser({ items, kinds, d }: { items: CredView[]; kinds: Kind[]; d: Dict }) {
  const [cur, setCur] = useState(0);
  const [detail, setDetail] = useState(false);
  if (!items.length) return <div className="pb"><div className="pn"><p className="mu">{d.noCreds}</p></div></div>;

  const label = { pendidikan: d.kPendidikan, sertifikat: d.kSertifikat, publikasi: d.kPublikasi, penghargaan: d.kPenghargaan } as const;
  const c = items[cur];
  const years = [...new Set(items.map((i) => i.year).filter((y): y is number => !!y))].sort((a, b) => b - a);
  const top = () => document.getElementById("mn")?.scrollTo(0, 0);

  return (
    <div className={"pj cj" + (detail ? " sd" : "")}>
      <div className="col list">
        <div className="ch"><span>{d.registry}</span><span className="chip">{f(d.nRecords, items.length)}</span></div>
        {kinds.map((k) => (
          <div key={k}>
            <div className="lh"><span>{label[k]}</span><span>{items.filter((i) => i.kind === k).length}</span></div>
            {items.map((it, i) => it.kind !== k ? null : (
              <button key={i} className="it" data-t aria-current={i === cur ? "true" : undefined} onClick={() => { setCur(i); setDetail(true); top(); }}>
                <small><span>{label[it.kind]}</span><span>{it.year ?? "—"}</span></small>
                <b>{it.title}</b>
                <i>{it.issuer}</i>
              </button>
            ))}
          </div>
        ))}
        <div className="pin sm"><span>{d.registry}</span><span>{String(cur + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div>
      </div>

      <div className="col dos">
        <div className="ch">
          <button className="btn o s bk" data-t onClick={() => { setDetail(false); top(); }}>{d.back}</button>
          <span className="chs"><span className="chip">{label[c.kind]}</span>{c.year && <span className="chip">{c.year}</span>}</span>
        </div>
        <div className="db cdet swap" key={cur}>
          <p className="ov">{c.issuer || label[c.kind]}</p>
          <h2>{c.title}</h2>
          {c.description && <p className="lead2">{c.description}</p>}
          <dl className="kv" style={{ marginTop: 18 }}>
            <dt>{d.type}</dt><dd>{label[c.kind]}</dd>
            {c.issuer && <><dt>{d.issuer}</dt><dd>{c.issuer}</dd></>}
            {c.year && <><dt>{d.yearL}</dt><dd>{c.year}</dd></>}
          </dl>
          <div className="pin">
            {c.url ? <a className="btn" data-t href={c.url} rel="noopener noreferrer">{d.viewProof}</a> : null}
          </div>
        </div>
      </div>

      <div className="col spec">
        <div className="ch"><span>{d.telemetry}</span><span className="mu">SYS.TEL_01</span></div>
        <div className="sb">
          <div className="sl">{d.byKind}</div>
          <div className="mm">
            {kinds.map((k) => <div key={k}><b>{String(items.filter((i) => i.kind === k).length).padStart(2, "0")}</b><small>{label[k]}</small></div>)}
          </div>
          {years.length > 0 && (<><div className="sl">{d.yearL}</div><div className="g2">{years.map((y) => <span key={y} className="tg">{y}</span>)}</div></>)}
        </div>
      </div>
    </div>
  );
}
