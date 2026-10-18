"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Mencatat kunjungan tanpa cookie dan tanpa IP: hanya jalur halaman, dihitung per hari di server. */
export default function PageView() {
  const path = usePathname();
  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    const body = JSON.stringify({ path });
    if (!navigator.sendBeacon?.("/api/pv", new Blob([body], { type: "application/json" }))) {
      fetch("/api/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, [path]);
  return null;
}
