import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import PageView from "@/components/PageView";
import Shell from "@/components/Shell";
import { getDict } from "@/lib/dict";
import { serif } from "@/lib/fonts";
import { isLocale, LOCALES } from "@/lib/i18n";
import { getSettings } from "@/server/modules/settings/service";
import "../globals.css";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));
export const viewport: Viewport = { viewportFit: "cover" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: { default: "Ahnaf", template: "Ahnaf – %s" },
    description: locale === "en"
      ? "Ahnaf’s portfolio: IoT systems, lightweight machine learning, and data tools."
      : "Portofolio Ahnaf: sistem IoT, machine learning ringan, dan alat bantu data.",
    alternates: { languages: { id: "/id", en: "/en" } },
  };
}

// Pengunjung yang sudah melihat loader di sesi ini langsung masuk tanpa kedip.
const boot = `try{if(sessionStorage.getItem('ld'))document.documentElement.classList.add('seen','rd')}catch(e){}`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const settings = await getSettings(locale);
  return (
    <html lang={locale} className={serif.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
      <body>
        <Loader />
        <Cursor />
        <PageView />
        <Shell locale={locale} d={getDict(locale)} settings={settings}>{children}</Shell>
        <noscript><style>{`.frame{opacity:1!important;transform:none!important}.ld{display:none}.nm span,.hero .rv,.tm p{animation:none!important}`}</style></noscript>
      </body>
    </html>
  );
}
