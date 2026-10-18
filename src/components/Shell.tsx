"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dict";
import { href, type Locale } from "@/lib/i18n";
import type { SettingsView } from "@/server/modules/settings/service";

const NAV = [["/", "nHome"], ["/about", "nAbout"], ["/projects", "nProjects"], ["/skills", "nSkills"], ["/credentials", "nCreds"], ["/guestbook", "nGuest"], ["/contact", "nContact"]] as const;

/** Bingkai tetap: header, Index Directory, footer. Hanya area konten yang berganti antarhalaman. */
export default function Shell({ children, locale, d, settings }: { children: React.ReactNode; locale: Locale; d: Dict; settings: SettingsView }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(false);
  const timers = useRef<{ show?: number; hide?: number; guard?: number; exit?: number }>({});
  const shownAt = useRef(0);
  const other: Locale = locale === "id" ? "en" : "id";

  // Animasi antarhalaman: bidikan yang sama dengan loader awal, hanya di area konten.
  // - Muncul bila perpindahan melebihi 120 ms (halaman cepat tidak berkedip).
  // - Terus berputar selama halaman belum berganti, berapa pun lamanya.
  // - Baru berakhir SETELAH jalur halaman berganti (usePathname), dengan jeda minimal 450 ms.
  const clearAll = () => Object.values(timers.current).forEach((t) => clearTimeout(t));
  const dismiss = () => {
    setOut(true);
    timers.current.exit = window.setTimeout(() => { setBusy(false); setOut(false); shownAt.current = 0; }, 260);
  };
  const begin = () => {
    clearAll();
    setOut(false);
    timers.current.show = window.setTimeout(() => { shownAt.current = Date.now(); setBusy(true); }, 120);
    timers.current.guard = window.setTimeout(dismiss, 30000); // hanya jaring pengaman bila perpindahan gagal total
  };
  const finish = () => {
    clearTimeout(timers.current.show);
    clearTimeout(timers.current.guard);
    if (!shownAt.current) return; // layar loading belum sempat tampil: tidak ada yang perlu ditutup
    const left = Math.max(0, 450 - (Date.now() - shownAt.current));
    clearTimeout(timers.current.hide);
    timers.current.hide = window.setTimeout(dismiss, left);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname) return;
    begin();
  };

  useEffect(() => { setOpen(false); main.current?.scrollTo(0, 0); finish(); }, [path]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, []);
  useEffect(() => {
    try { const t = localStorage.getItem("th"); if (t) document.documentElement.dataset.theme = t; } catch {}
  }, []);

  const toggleTheme = () => {
    const h = document.documentElement;
    const now = h.dataset.theme || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    const next = now === "dark" ? "light" : "dark";
    h.dataset.theme = next;
    try { localStorage.setItem("th", next); } catch {}
  };
  const active = (p: string) => { const h = href(locale, p); return p === "/" ? path === h : path === h || path.startsWith(h + "/"); };

  return (
    <div className="app">
      <div className="frame" onClickCapture={onClickCapture}>
        <header className="hd">
          <Link className="br" href={href(locale)} data-t><i className="sq" />A. Ahnaf / 2026 <span className="chip">{settings.locChip}</span></Link>
          <div className="hr">
            <button className="ib mb" data-t aria-expanded={open} aria-controls="dir" onClick={() => setOpen((o) => !o)}>{d.menu}</button>
            <Link className="ib lg2" href={path.replace(/^\/(id|en)/, `/${other}`) || `/${other}`} data-t aria-label={d.langAria} hrefLang={other}
              onClick={() => { document.cookie = `lang=${other};path=/;max-age=31536000;samesite=lax`; }}>{other.toUpperCase()}</Link>
            <Link className="ib" href={href(locale, "/contact")} data-t aria-label={d.contactAria}>
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" /><path d="M3 6l9 7 9-7" /></svg>
            </Link>
            <button className="ib" data-t aria-label={d.theme} onClick={toggleTheme}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 4v16" /></svg>
            </button>
            <span className="ib av" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5" /><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" /></svg></span>
          </div>
        </header>

        <nav className={"dir" + (open ? " open" : "")} id="dir" aria-label={d.dirTitle}>
          <div className="dh up"><span>{d.dirTitle}</span><span>07</span></div>
          <div className="dl">
            {NAV.map(([p, key], i) => (
              <Link key={p} href={href(locale, p)} data-t className={active(p) ? "on" : undefined} aria-current={active(p) ? "page" : undefined}>
                <small>0{i + 1}</small>— {d[key]}
              </Link>
            ))}
          </div>
          <div className="dn"><u />{d.nodeSynced}<br />{d.latency} 14 ms</div>
        </nav>
        <div className={"sc" + (open ? " on" : "")} onClick={() => setOpen(false)} />

        <main className="mn" id="mn" ref={main}>{children}</main>
        {busy && (
          <div className={"tv" + (out ? " out" : "")} role="status" aria-live="polite">
            <div className="fr"><b /><b /><b /><b /></div>
            <p>{d.loading}</p>
          </div>
        )}

        <footer className="ft-b"><span>{settings.footerLeft}</span><span>{settings.footerRight}</span></footer>
      </div>
    </div>
  );
}
