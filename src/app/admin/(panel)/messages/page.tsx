import * as repo from "@/server/modules/contact/repo";
import { deleteContact, setContactStatus } from "@/server/modules/contact/actions";

const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });
const order = { baru: 0, dibalas: 1, arsip: 2 } as const;

export default async function Messages() {
  const all = await repo.listAll().catch(() => null);
  const items = all?.slice().sort((a, b) => order[a.status] - order[b.status]);
  return (
    <>
      <h1>Pesan masuk.</h1>
      {!items ? <div className="card">Database belum terhubung.</div> : !items.length ? <p className="mu">Belum ada pesan dari halaman Kontak.</p> : (
        <table className="tbl">
          <thead><tr><th>Status</th><th>Pesan</th><th /></tr></thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id}>
                <td>{m.status === "baru" ? <span className="chip">Baru</span> : m.status}</td>
                <td><b>{m.subject}</b><br /><span className="mu">{m.name} · {m.email} · {fmt.format(m.createdAt)}</span><br />{m.message}</td>
                <td className="row">
                  <a className="btn s" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}>Balas</a>
                  {m.status !== "dibalas" && <form action={setContactStatus.bind(null, m.id, "dibalas")}><button className="btn o s">Tandai dibalas</button></form>}
                  {m.status !== "arsip" && <form action={setContactStatus.bind(null, m.id, "arsip")}><button className="btn o s">Arsipkan</button></form>}
                  <form action={deleteContact.bind(null, m.id)}><button className="btn o s">Hapus</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
