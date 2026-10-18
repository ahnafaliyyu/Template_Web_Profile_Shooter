import { notFound } from "next/navigation";
import { f } from "@/lib/fmt";
import { getDict } from "@/lib/dict";
import { href, LOCALES } from "@/lib/i18n";
import { getLocale } from "@/lib/params";
import { listProjects } from "@/server/modules/projects/service";
import ProjectBrowser from "../ProjectBrowser";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await listProjects("id");
  return LOCALES.flatMap((locale) => items.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale(params);
  const p = (await listProjects(locale)).find((x) => x.slug === slug);
  return { title: p?.title ?? getDict(locale).nProjects, description: p?.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale(params);
  const d = getDict(locale);
  const items = await listProjects(locale);
  if (!items.some((p) => p.slug === slug)) notFound();
  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.projOv}</p>
        <h1>{d.archive}</h1>
        <div className="chs"><span className="chip">{f(d.nWorks, items.length)}</span></div>
      </header>
      <ProjectBrowser items={items} initial={slug} base={href(locale, "/projects")} d={d} />
      <div className="pbar"><span>{d.mProjects} <b>{items.length}</b></span><span>{d.mTech} <b>{new Set(items.flatMap((p) => p.stack)).size}</b></span><span>{d.mFields} <b>{new Set(items.map((p) => p.kind)).size}</b></span></div>
    </div>
  );
}
