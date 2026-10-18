import type { Metadata } from "next";
import { serif } from "@/lib/fonts";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={serif.variable}>
      <body><div className="adm">{children}</div></body>
    </html>
  );
}
