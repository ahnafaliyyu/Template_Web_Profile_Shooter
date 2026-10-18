import { getDict } from "@/lib/dict";
import { f } from "@/lib/fmt";
import { href } from "@/lib/i18n";
import { getLocale, titleOf } from "@/lib/params";
import { listProjects } from "@/server/modules/projects/service";
import ProjectBrowser from "./ProjectBrowser";

export const revalidate = 600;
export const generateMetadata = titleOf("nProjects");

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const items = await listProjects(locale);
  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.projOv}</p>
        <h1>{d.archive}</h1>
        <div className="chs"><span className="chip">{f(d.nWorks, items.length)}</span></div>
      </header>
      <ProjectBrowser items={items} base={href(locale, "/projects")} d={d} />
      <div className="pbar"><span>{d.mProjects} <b>{items.length}</b></span><span>{d.mTech} <b>{new Set(items.flatMap((p) => p.stack)).size}</b></span><span>{d.mFields} <b>{new Set(items.map((p) => p.kind)).size}</b></span></div>
    </div>
  );
}
