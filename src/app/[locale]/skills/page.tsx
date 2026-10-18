import { getDict } from "@/lib/dict";
import { f } from "@/lib/fmt";
import { getLocale, titleOf } from "@/lib/params";
import { listProjects } from "@/server/modules/projects/service";
import { groupSkills, listSkills } from "@/server/modules/skills/service";

export const revalidate = 600;
export const generateMetadata = titleOf("nSkills");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default async function Skills({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const [skills, projects] = await Promise.all([listSkills(), listProjects(locale)]);
  const groups = groupSkills(skills);
  const uses = (name: string) => projects.filter((p) => p.stack.some((s) => s.toLowerCase() === name.toLowerCase())).length;
  const freq = new Map<string, number>();
  for (const p of projects) for (const s of p.stack) freq.set(s, (freq.get(s) ?? 0) + 1);
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(1, ...top.map((t) => t[1]));

  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.skillsOv}</p>
        <h1>{d.skillsTitle}</h1>
        <div className="chs"><span className="chip">{f(d.nTech, skills.length)}</span><span className="chip">{f(d.nGroups, groups.length)}</span></div>
      </header>

      <div className="pb" style={{ "--cols": "280px minmax(0,1fr) 310px" } as React.CSSProperties}>
        <aside className="pn">
          <div className="pt"><span>{d.domains}</span><span>{String(groups.length).padStart(2, "0")}</span></div>
          {groups.map(([g, items], i) => (
            <a key={g} className="gi" href={`#${slug(g)}`} data-t>
              <b>[{String(i + 1).padStart(2, "0")}] {g}</b>
              <small>{items.slice(0, 3).map((s) => s.name).join(" · ")}</small>
            </a>
          ))}
          <p className="mu pin" style={{ fontSize: ".9rem" }}>{d.levelNote}</p>
        </aside>

        <section className="pn">
          {groups.map(([g, items], i) => {
            const used = projects.filter((p) => p.stack.some((s) => items.some((it) => it.name.toLowerCase() === s.toLowerCase()))).length;
            return (
              <article key={g} id={slug(g)} className="spc" style={{ scrollMarginTop: 12 }}>
                <div className="h"><span className="tagb">SPEC-{String(i + 1).padStart(2, "0")}</span><h2>{g}</h2></div>
                <div className="b">
                  <div className="ar">{items.map((s) => <span key={s.name} className="tg">{s.name}{s.level ? <small>L{s.level}</small> : uses(s.name) ? <small>×{uses(s.name)}</small> : null}</span>)}</div>
                  <p className="mu" style={{ margin: "12px 0 0", fontSize: ".95rem" }}>{f(d.usedIn, used)}</p>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="pn">
          <div className="mm"><div><b>{String(skills.length).padStart(2, "0")}</b><small>{d.mTech}</small></div><div><b>{String(groups.length).padStart(2, "0")}</b><small>{d.domains}</small></div></div>
          <div className="pt"><span>{d.fromWorks}</span></div>
          <div className="bars">
            {top.length ? top.map(([n, c]) => <div key={n}><span>{n}</span><span className="mu">{f(d.inWorks, c)}</span><i style={{ "--w": `${(c / max) * 100}%` } as React.CSSProperties} /></div>) : <p className="mu">{d.noData}</p>}
          </div>
        </aside>
      </div>

      <div className="pbar"><span>{d.mTech} <b>{skills.length}</b></span><span>{d.domains} <b>{groups.length}</b></span><span>{d.mProjects} <b>{projects.length}</b></span></div>
    </div>
  );
}
