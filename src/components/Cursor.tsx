"use client";
import { useEffect, useRef } from "react";

/** Kursor kotak kecil yang berubah menjadi bidikan saat mengenai elemen ber-atribut data-t. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const el = ref.current!;
    const html = document.documentElement;
    const main = document.getElementById("mn");
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const S = { x: -50, y: -50, w: 10, h: 10 };
    const T = { ...S };
    const keys = ["x", "y", "w", "h"] as const;
    let target: Element | null = null;
    let raf = 0;

    const step = () => {
      raf = 0;
      if (target) {
        const r = target.getBoundingClientRect();
        T.x = r.left - 5; T.y = r.top - 5; T.w = r.width + 10; T.h = r.height + 10;
      }
      const k = reduce ? 1 : target ? 0.32 : 0.42;
      let d = 0;
      for (const q of keys) { const v = T[q] - S[q]; S[q] += v * k; d += Math.abs(v); }
      el.style.transform = `translate(${S.x}px,${S.y}px)`;
      el.style.width = `${S.w}px`;
      el.style.height = `${S.h}px`;
      if (d > 0.3) raf = requestAnimationFrame(step);
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(step); };

    const move = (e: PointerEvent) => {
      if (!target) { T.x = e.clientX - 5; T.y = e.clientY - 5; T.w = T.h = 10; }
      if (!el.classList.contains("on")) {
        S.x = T.x = e.clientX - 5; S.y = T.y = e.clientY - 5;
        el.classList.add("on"); html.classList.add("cx");
      }
      go();
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.("[data-t]") ?? null;
      if (t === target) return;
      target = t;
      el.classList.toggle("lk", !!t);
      if (!t) { T.w = T.h = 10; T.x = e.clientX - 5; T.y = e.clientY - 5; }
      go();
    };
    const leave = () => { el.classList.remove("on"); html.classList.remove("cx"); };

    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    html.addEventListener("pointerleave", leave);
    main?.addEventListener("scroll", go, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      html.removeEventListener("pointerleave", leave);
      main?.removeEventListener("scroll", go);
      cancelAnimationFrame(raf);
      html.classList.remove("cx");
    };
  }, []);

  return <div className="cur" ref={ref} aria-hidden="true"><b /><b /><b /><b /></div>;
}
