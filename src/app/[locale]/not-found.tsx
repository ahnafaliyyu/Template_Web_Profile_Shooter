import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pg">
      <div className="ph"><p className="ov"><i className="sq" />404</p><h1>404.</h1></div>
      <div className="pb" style={{ ["--cols" as string]: "1fr" }}>
        <div className="pn"><p className="lead">Halaman tidak ditemukan. · Page not found.</p><p><Link className="btn" href="/" data-t>← Home</Link></p></div>
      </div>
    </section>
  );
}
