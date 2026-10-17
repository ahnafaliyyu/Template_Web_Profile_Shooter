"use client";
import { useEffect, useRef } from "react";

/** Layar loading kalem: bidikan besar merapat ke satu titik. Hanya lapisan di atas konten asli. */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("seen")) return;
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const min = reduce ? 250 : 1900;
    const t0 = Date.now();
    let timer = 0;

    Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 2600))]).then(() => {
      timer = window.setTimeout(() => {
        ref.current?.classList.add("out");
        html.classList.add("rd");
        try { sessionStorage.setItem("ld", "1"); } catch {}
      }, Math.max(0, min - (Date.now() - t0)));
    });
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ld" id="ld" ref={ref} aria-hidden="true">
      <div className="fr"><b /><b /><b /><b /></div>
      <p className="lt">AHNAF / 2026</p>
      <p className="ls up"><span>memuat</span><span>menyelaraskan</span><span>siap</span></p>
    </div>
  );
}
