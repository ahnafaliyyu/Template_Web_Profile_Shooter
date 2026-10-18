import Link from "next/link";
import { f } from "@/lib/fmt";
import HeroReticle from "@/components/HeroReticle";
import RoleSwap from "@/components/RoleSwap";
import { getDict } from "@/lib/dict";
import { href } from "@/lib/i18n";
import { getLocale } from "@/lib/params";
import { listCredentials } from "@/server/modules/credentials/service";
import { getProfile } from "@/server/modules/profile/service";
import { listProjects } from "@/server/modules/projects/service";
import { getSettings } from "@/server/modules/settings/service";
import { listSkills } from "@/server/modules/skills/service";

export const revalidate = 600;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const [profile, projects, skills, creds, settings] = await Promise.all([getProfile(locale), listProjects(locale), listSkills(), listCredentials(locale), getSettings(locale)]);
  const fl = projects.filter((p) => p.featured);
  const flagship = (fl.length ? fl : projects).slice(0, 3);
  const sk = skills.filter((s) => s.featured);
  const arsenal = (sk.length ? sk : skills).slice(0, 8);
  const stackCount = new Set(projects.flatMap((p) => p.stack)).size;
  const metrics: [string, number][] = [
    [d.mProjects, projects.length], [d.mTech, stackCount], [d.mFields, new Set(projects.map((p) => p.kind)).size], [d.mPubs, creds.filter((c) => c.kind === "publikasi").length],
  ];
  const log = [d.logBoot, f(d.logProfile, profile.name.toLowerCase()), f(d.logCount, projects.length, stackCount), profile.availability ? f(d.logStatus, profile.availability.toLowerCase()) : ""].filter(Boolean);

  return (
    <div className="pg ent">
      <section className="hero">
        <HeroReticle />
        <p className="ov"><i className="sq" />{d.homeOv}</p>
        <div className="st rv">
          {profile.availability && <span className="chip"><i />{profile.availability}</span>}
          {profile.location && <span className="chip">{profile.location}</span>}
        </div>
        <h1 className="nm" aria-label={profile.name}>
          {[...profile.name].map((c, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">{c}</span>)}
          <span style={{ "--i": profile.name.length } as React.CSSProperties} aria-hidden="true">.</span>
        </h1>
        <p className="rl rv" style={{ animationDelay: ".7s" }}>
          {profile.role}. {d.iBuild} <RoleSwap items={profile.tags.length ? profile.tags : [profile.focus || "…"]} />
        </p>
        <p className="sub rv" style={{ animationDelay: ".85s" }}>{profile.bio}</p>
        <p className="cta rv" style={{ animationDelay: "1s" }}>
          <Link className="btn" href={href(locale, "/projects")} data-t>{d.ctaProjects}</Link>
          <Link className="btn o" href={href(locale, "/contact")} data-t>{d.ctaContact}</Link>
        </p>
      </section>

      <section className="mt" aria-label="Ringkasan">
        {metrics.map(([label, n]) => <div key={label}><b>{String(n).padStart(2, "0")}</b><small>{label}</small></div>)}
      </section>

      <div className="hb">
        <div className="sh"><span>{d.featured}</span><Link href={href(locale, "/projects")} data-t>{d.allWorks}</Link></div>
        <section className="fl">
          {flagship.map((p, i) => (
            <Link key={p.slug} className="fc" href={href(locale, `/projects/${p.slug}`)} data-t>
              <small><span>{String(i + 1).padStart(2, "0")} · {p.year} {p.kind}</span><span>{d.openDossier}</span></small>
              <h3>{p.title}</h3>
              <p className="mu">{p.summary}</p>
              <span className="tags">{p.stack.slice(0, 4).join(" · ")}</span>
            </Link>
          ))}
        </section>

        <section className="tw" style={{ marginBottom: 24 }}>
          <div>
            <div className="sh"><span>{d.sysLog}</span><span>TTY_1</span></div>
            <div className="tm" aria-hidden="true">
              {log.map((l, i) => <p key={i} style={{ "--i": i } as React.CSSProperties}>&gt; {l}</p>)}
              <p style={{ "--i": log.length } as React.CSSProperties}>&gt; {d.logWait} <span className="cr" /></p>
            </div>
          </div>
          <div>
            <div className="sh"><span>{d.arsenal}</span><Link href={href(locale, "/skills")} data-t>{d.allSkills}</Link></div>
            <div className="ar">{arsenal.map((s) => <span key={s.name} className="tg">{s.name}{s.level ? <small>L{s.level}</small> : null}</span>)}</div>
          </div>
        </section>
      </div>

      <section className="dp">
        <div>
          <p className="ov" style={{ color: "inherit", opacity: 0.7 }}>{d.dispatch}</p>
          <h2>{settings.dispatchTitle}</h2>
        </div>
        <Link className="btn inv" href={href(locale, "/contact")} data-t>{d.sendMsg}</Link>
      </section>
    </div>
  );
}
