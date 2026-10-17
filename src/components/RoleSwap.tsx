"use client";
import { useEffect, useState } from "react";

/** Kalimat peran yang berganti pelan. Tanpa gerak (reduced motion) menampilkan yang pertama saja. */
export default function RoleSwap({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2 || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 2800);
    return () => clearInterval(t);
  }, [items.length]);
  return <b key={i}>{items[i] ?? ""}</b>;
}
