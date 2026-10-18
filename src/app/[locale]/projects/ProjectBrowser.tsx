"use client";
import { f } from "@/lib/fmt";
import { useState } from "react";
import type { Dict } from "@/lib/dict";
import type { ProjectView } from "@/server/modules/projects/types";

/** Daftar, dosir, dan spesifikasi. Di layar kecil menjadi dua langkah (daftar lalu dosir). */
export default function ProjectBrowser({ items, initial, base, d }: { items: ProjectView[]; initial?: string; base: string; d: Dict }) {
  const start = Math.max(0, items.findIndex((p) => p.slug === initial));
  const [cur, setCur] = useState(start);
  const [detail, setDetail] = useState(!!initial);
  const [shot, setShot] = useState<Record<string, number>>({});
  const n = items.length;
  if (!n) return <div className="pb"><div className="pn"><p className="mu">{d.noProjects}</p></div></div>;

  const STATUS = { aktif: d.sAktif, selesai: d.sSelesai, konsep: d.sKonsep } as const;
  const ACCESS = { publik: d.aPublik, privat: d.aPrivat } as const;
  const p = items[cur];
  const img = p.images[shot[p.slug] ?? 0];
  const top = () => document.getElementById("mn")?.scrollTo(0, 0);
  const go = (i: number) => { const k = (i + n) % n; setCur(k); history.replaceState(null, "", `${base}/${items[k].slug}`); };
  const pick = (i: number) => { setCur(i); setDetail(true); history.replaceState(null, "", `${base}/${items[i].slug}`); top(); }; // tautan bisa dibagikan tanpa muat ulang
  const latest = Math.max(...items.map((x) => x.year));

  return (
    <div className={"pj" + (detail ? " sd" : "")}>
      <div className="col list">
        <div className="ch"><span>{d.list}</span><span className="chip">{f(d.nWorks, n)}</span></div>
        {items.map((it, i) => (
          <button key={it.slug} className="it" data-t onClick={() => pick(i)} aria-current={i === cur ? "true" : undefined}>
            <small><span>{it.year} {it.kind}</span><span>#{String(i + 1).padStart(2, "0")}</span></small>
            <b>{it.title}</b>
            <i><u className={it.status === "aktif" ? "ok" : ""} />{STATUS[it.status]}</i>
          </button>
        ))}
        <div className="pin sm"><span>{d.archiveStat} · {f(d.nWorks, n)}</span><span>{d.latestWork} · {latest}</span></div>
      </div>

      <div className="col dos">
        <div className="ch">
          <button className="btn o s bk" data-t onClick={() => { setDetail(false); top(); }}>{d.back}</button>
          <span className="chs"><span className="chip">{STATUS[p.status]}</span><span className="chip">{ACCESS[p.access]}</span></span>
          <span className="nv">
            <button className="btn o s" data-t aria-label={d.prevW} onClick={() => go(cur - 1)}>←</button>
            <span>{f(d.workOf, cur + 1, n)}</span>
            <button className="btn o s" data-t aria-label={d.nextW} onClick={() => go(cur + 1)}>→</button>
          </span>
        </div>
        <div className="db swap" key={p.slug}>
          <p className="ov">{p.year} / {p.kind}</p>
          <h2>{p.title}</h2>
          <div className="shot">{img ? <img src={img.url} alt={img.alt || p.title} loading="lazy" /> : d.noShot}</div>
          {p.images.length > 1 && (
            <div className="thumbs">
              {p.images.map((im, i) => (
                <button key={im.url} data-t aria-label={`${p.title} ${i + 1}`} aria-current={(shot[p.slug] ?? 0) === i ? "true" : undefined} onClick={() => setShot({ ...shot, [p.slug]: i })}>
                  <img src={im.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <p>{p.summary}</p>
          {p.note && <p className="mu">{p.note}</p>}
          <div className="ftr"><span>{d.classification}: {ACCESS[p.access]}</span><span>{d.serial} // PRJ-{String(cur + 1).padStart(3, "0")}</span></div>
        </div>
      </div>

      <div className="col spec">
        <div className="ch"><span>{d.spec}</span><span className="mu">ATTR_01</span></div>
        <div className="sb swap" key={p.slug}>
          <div className="sl">{d.progress}</div>
          <div className="sv">{STATUS[p.status]}</div>
          <div className="bar" style={{ "--w": `${p.progress}%` } as React.CSSProperties}><i /></div>
          <div className="sl">{d.info}</div>
          <div className="g2">
            <div className="cell"><small>{d.type}</small><b>{p.kind}</b></div>
            <div className="cell"><small>{d.year}</small><b>{p.year}</b></div>
          </div>
          {p.framework && <div className="cell" style={{ marginTop: 6 }}><small>{d.framework}</small><b>{p.framework}</b></div>}
          <div className="sl">{d.stack}</div>
          <div className="g2">{p.stack.map((k) => <span key={k} className="tg">{k}</span>)}</div>
          <div className="pin">
            <div className="sl">{d.access}</div>
            <span className="btn o" data-t>{p.access === "publik" ? d.viewCode : d.privateRepo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
