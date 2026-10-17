import Link from "next/link";
import HeroReticle from "@/components/HeroReticle";
import RoleSwap from "@/components/RoleSwap";
import { listCredentials } from "@/server/modules/credentials/service";
import { getProfile } from "@/server/modules/profile/service";
import { listProjects } from "@/server/modules/projects/service";
import { listSkills } from "@/server/modules/skills/service";

export const revalidate = 3600;

export default async function Home() {
  const [profile, projects, skills, creds] = await Promise.all([getProfile(), listProjects(), listSkills(), listCredentials()]);
  const flagship = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const arsenal = (skills.filter((s) => s.featured).length ? skills.filter((s) => s.featured) : skills).slice(0, 8);
  const stackCount = new Set(projects.flatMap((p) => p.stack)).size;
  const fieldCount = new Set(projects.map((p) => p.kind)).size;
  const pubs = creds.filter((c) => c.kind === "publikasi").length;
  const metrics: [string, number][] = [["Karya terbit", projects.length], ["Teknologi", stackCount], ["Bidang", fieldCount], ["Publikasi", pubs]];
  const log = [
    "boot dossier_root ........ OK",
    `profil dimuat: ${profile.name.toLowerCase()}`,
    `${projects.length} karya terbit · ${stackCount} teknologi`,
    profile.availability ? `status: ${profile.availability.toLowerCase()}` : "status: aktif",
  ];

  return (
    <div className="ent">
      <section className="hero">
        <HeroReticle />
        <p className="ov"><i className="sq" />Index_root // Dossier_01</p>
        <div className="st rv">
          {profile.availability && <span className="chip"><i />{profile.availability}</span>}
          {profile.location && <span className="chip">{profile.location}</span>}
        </div>
        <h1 className="nm" aria-label={profile.name}>
          {[...profile.name].map((c, i) => <span key={i} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">{c}</span>)}
          <span style={{ "--i": profile.name.length } as React.CSSProperties} aria-hidden="true">.</span>
        </h1>
        <p className="rl rv" style={{ animationDelay: ".7s" }}>
          {profile.role}. Saya membangun <RoleSwap items={profile.tags.length ? profile.tags : [profile.focus || "hal yang dipakai"]} />
        </p>
        <p className="sub rv" style={{ animationDelay: ".85s" }}>{profile.bio}</p>
        <p className="cta rv" style={{ animationDelay: "1s" }}>
          <Link className="btn" href="/projects" data-t>Lihat arsip karya ↗</Link>
          <Link className="btn o" href="/contact" data-t>Hubungi saya</Link>
        </p>
      </section>

      <section className="mt" aria-label="Ringkasan">
        {metrics.map(([label, n]) => <div key={label}><b>{String(n).padStart(2, "0")}</b><small>{label}</small></div>)}
      </section>

      <div className="sh"><span>Karya unggulan</span><Link href="/projects" data-t>Semua karya →</Link></div>
      <section className="fl">
        {flagship.map((p, i) => (
          <Link key={p.slug} className="fc" href={`/projects/${p.slug}`} data-t>
            <small><span>{String(i + 1).padStart(2, "0")} · {p.year} {p.kind}</span><span>Buka dosir ↗</span></small>
            <h3>{p.title}</h3>
            <p className="mu">{p.summary}</p>
            <span className="tags">{p.stack.slice(0, 4).join(" · ")}</span>
          </Link>
        ))}
      </section>

      <section className="tw">
        <div>
          <div className="sh"><span>Log sistem</span><span>TTY_1</span></div>
          <div className="tm" aria-hidden="true">
            {log.map((l, i) => <p key={i} style={{ "--i": i } as React.CSSProperties}>&gt; {l}</p>)}
            <p style={{ "--i": log.length } as React.CSSProperties}>&gt; menunggu pesan <span className="cr" /></p>
          </div>
        </div>
        <div>
          <div className="sh"><span>Arsenal</span><Link href="/skills" data-t>Semua skill →</Link></div>
          <div className="ar">
            {arsenal.map((s) => <span key={s.name} className="tg">{s.name}{s.level ? <small>L{s.level}</small> : null}</span>)}
          </div>
        </div>
      </section>

      <section className="dp">
        <div>
          <p className="ov" style={{ color: "inherit", opacity: 0.7 }}>Direct dispatch</p>
          <h2>Punya ide atau proyek? Mari bicara.</h2>
        </div>
        <Link className="btn inv" href="/contact" data-t>Kirim pesan ↗</Link>
      </section>
    </div>
  );
}
