"use client";
import { useEffect, useRef } from "react";

const brk = (a: number, b: number, l: number) =>
  `M${a + l} ${a}H${a}V${a + l}M${b - l} ${a}H${b}V${a + l}M${a} ${b - l}V${b}H${a + l}M${b} ${b - l}V${b}H${b - l}`;

/** Bidikan besar di hero: bernapas pelan dan sedikit bergeser mengikuti pointer. Hanya CSS variable, tanpa pustaka. */
export default function HeroReticle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const hero = el?.parentElement;
    if (!el || !hero || matchMedia("(prefers-reduced-motion:reduce)").matches || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    let raf = 0, x = 0, y = 0;
    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.setProperty("--px", x.toFixed(3)); el.style.setProperty("--py", y.toFixed(3)); });
    };
    hero.addEventListener("pointermove", move, { passive: true });
    return () => { hero.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="rt" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <g className="p1"><g className="br1"><path d={brk(14, 186, 24)} /></g></g>
        <g className="p2"><g className="br2"><path d={brk(46, 154, 16)} /></g></g>
        <g className="p3"><g className="br3"><path d={brk(78, 122, 9)} /></g></g>
        <line className="xh" x1="0" y1="100" x2="200" y2="100" />
        <line className="xh" x1="100" y1="0" x2="100" y2="200" />
        <circle className="dot" cx="100" cy="100" r="2.6" />
      </svg>
    </div>
  );
}
