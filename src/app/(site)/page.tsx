import Link from "next/link";

export default function Home() {
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />Index_root // 2026</p>
      <h1>Ahnaf.</h1>
      <p className="lead">Mahasiswa Informatika. Membangun sistem IoT, model machine learning ringan, dan alat bantu data untuk masalah nyata.</p>
      <p><Link className="btn" href="/projects" data-t>Lihat arsip karya ↗</Link></p>
    </section>
  );
}
