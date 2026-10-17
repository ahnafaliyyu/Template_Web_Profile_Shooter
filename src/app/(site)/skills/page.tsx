import { groupSkills, listSkills } from "@/server/modules/skills/service";

export const revalidate = 3600;
export const metadata = { title: "Skills" };

export default async function Skills() {
  const groups = groupSkills(await listSkills());
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />Arsenal // Skill</p>
      <h1>Skills.</h1>
      <div className="sg">
        {groups.map(([group, items]) => (
          <div key={group} className="sgc">
            <div className="ch"><span>{group}</span><span className="mu">{String(items.length).padStart(2, "0")}</span></div>
            <div className="ar sgb">{items.map((s) => <span key={s.name} className="tg">{s.name}{s.level ? <small>L{s.level}</small> : null}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
