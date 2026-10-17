import type { Metadata, Viewport } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Ahnaf", template: "Ahnaf – %s" },
  description: "Portofolio Ahnaf: sistem IoT, machine learning ringan, dan alat bantu data.",
};
export const viewport: Viewport = { viewportFit: "cover" };

// Pengunjung yang sudah melihat loader di sesi ini langsung masuk tanpa kedip.
const boot = `try{if(sessionStorage.getItem('ld'))document.documentElement.classList.add('seen','rd')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={serif.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        {children}
        <noscript>
          <style>{`.frame{opacity:1!important;transform:none!important}.ld{display:none}.nm span,.hero .rv,.tm p{animation:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
