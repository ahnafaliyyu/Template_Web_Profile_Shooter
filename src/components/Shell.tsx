"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV = [
  ["/", "Home"], ["/about", "About"], ["/projects", "Projects"], ["/skills", "Skills"],
  ["/credentials", "Credentials"], ["/guestbook", "Guestbook"], ["/contact", "Contact"],
] as const;

/** Bingkai tetap: header, Index Directory, footer. Hanya area konten yang berganti antarhalaman. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
    main.current?.scrollTo(0, 0);
  }, [path]);

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

  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

  return (
    <div className="app">
      <div className="frame">
        <header className="hd">
          <Link className="br" href="/" data-t><i className="sq" />A. Ahnaf / 2026 <span className="chip">SYS.LOC // ID</span></Link>
          <div className="hr">
            <button className="ib mb" data-t aria-expanded={open} aria-controls="dir" onClick={() => setOpen((o) => !o)}>Menu</button>
            <Link className="ib" href="/contact" data-t aria-label="Kontak">
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" /><path d="M3 6l9 7 9-7" /></svg>
            </Link>
            <button className="ib" data-t aria-label="Ganti tema" onClick={toggleTheme}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 4v16" /></svg>
            </button>
            <span className="ib av" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5" /><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" /></svg>
            </span>
          </div>
        </header>

        <nav className={"dir" + (open ? " open" : "")} id="dir" aria-label="Index Directory">
          <div className="dh up"><span>Index Directory</span><span>07</span></div>
          <div className="dl">
            {NAV.map(([href, label], i) => (
              <Link key={href} href={href} data-t className={active(href) ? "on" : undefined} aria-current={active(href) ? "page" : undefined}>
                <small>0{i + 1}</small>— {label}
              </Link>
            ))}
          </div>
          <div className="dn"><u />Node: synced<br />Latency 14 ms</div>
        </nav>
        <div className={"sc" + (open ? " on" : "")} onClick={() => setOpen(false)} />

        <main className="mn" id="mn" ref={main}>{children}</main>

        <footer className="ft-b"><span>Mahasiswa Informatika / IoT · ML</span><span>Arsip // ID-2026</span></footer>
      </div>
    </div>
  );
}
