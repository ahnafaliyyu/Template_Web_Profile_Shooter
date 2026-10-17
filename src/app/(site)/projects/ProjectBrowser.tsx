"use client";
import { useState } from "react";
import type { ProjectView } from "@/server/modules/projects/types";

const STATUS = { aktif: "Aktif", selesai: "Selesai", konsep: "Konsep" } as const;
const ACCESS = { publik: "Publik", privat: "Privat" } as const;

/** Daftar, dosir, dan spesifikasi. Di layar kecil menjadi dua langkah (daftar lalu dosir). */
export default function ProjectBrowser({ items }: { items: ProjectView[] }) {
  const [cur, setCur] = useState(0);
  const [detail, setDetail] = useState(false);
  const n = items.length;
  if (!n) return <p className="mu">Belum ada karya yang diterbitkan.</p>;

  const p = items[cur];
  const go = (i: number) => setCur((i + n) % n);
  const pick = (i: number) => {
    setCur(i);
    setDetail(true);
    document.getElementById("mn")?.scrollTo(0, 0);
  };

  return (
    <div className={"pj" + (detail ? " sd" : "")}>
      <div className="col list">
        <div className="ch"><span>Daftar karya</span><span className="chip">{n} karya</span></div>
        {items.map((it, i) => (
          <button key={it.slug} className="it" data-t onClick={() => pick(i)} aria-current={i === cur ? "true" : undefined}>
            <small><span>{it.year} {it.kind}</span><span>#{String(i + 1).padStart(2, "0")}</span></small>
            <b>{it.title}</b>
            <i><u className={it.status === "aktif" ? "ok" : ""} />{STATUS[it.status]}</i>
          </button>
        ))}
      </div>

      <div className="col dos">
        <div className="ch">
          <button className="btn o s bk" data-t onClick={() => { setDetail(false); document.getElementById("mn")?.scrollTo(0, 0); }}>← Daftar</button>
          <span className="chs"><span className="chip">{STATUS[p.status]}</span><span className="chip">{ACCESS[p.access]}</span></span>
          <span className="nv">
            <button className="btn o s" data-t aria-label="Karya sebelumnya" onClick={() => go(cur - 1)}>←</button>
            <span>Karya {cur + 1} dari {n}</span>
            <button className="btn o s" data-t aria-label="Karya berikutnya" onClick={() => go(cur + 1)}>→</button>
          </span>
        </div>
        <div className="db swap" key={p.slug}>
          <p className="ov">{p.year} / {p.kind}</p>
          <h2>{p.title}</h2>
          <div className="shot">Tangkapan layar · belum ada</div>
          <p>{p.summary}</p>
          {p.note && <p className="mu">{p.note}</p>}
          <div className="ftr"><span>Klasifikasi: {ACCESS[p.access]}</span><span>Serial // PRJ-{String(cur + 1).padStart(3, "0")}</span></div>
        </div>
      </div>

      <div className="col spec">
        <div className="ch"><span>Spesifikasi</span><span className="mu">ATTR_01</span></div>
        <div className="sb swap" key={p.slug}>
          <div className="sl">Progres</div>
          <div className="sv">{STATUS[p.status]}</div>
          <div className="bar" style={{ "--w": `${p.progress}%` } as React.CSSProperties}><i /></div>
          <div className="sl">Info proyek</div>
          <div className="g2">
            <div className="cell"><small>Jenis</small><b>{p.kind}</b></div>
            <div className="cell"><small>Tahun</small><b>{p.year}</b></div>
          </div>
          {p.framework && <div className="cell" style={{ marginTop: 6 }}><small>Kerangka</small><b>{p.framework}</b></div>}
          <div className="sl">Stack</div>
          <div className="g2">{p.stack.map((k) => <span key={k} className="tg">{k}</span>)}</div>
          <div className="sl">Akses</div>
          <span className="btn o" data-t>{p.access === "publik" ? "Lihat kode ↗" : "Repo privat"}</span>
        </div>
      </div>
    </div>
  );
}
