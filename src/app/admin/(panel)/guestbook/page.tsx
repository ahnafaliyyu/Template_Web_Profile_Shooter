import * as repo from "@/server/modules/guestbook/repo";
import { deleteGuestbook, moderateGuestbook } from "@/server/modules/guestbook/actions";

const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });
const order = { pending: 0, approved: 1, hidden: 2 } as const;

export default async function AdminGuestbook() {
  const all = await repo.listAll().catch(() => null);
  const items = all?.slice().sort((a, b) => order[a.status] - order[b.status]);
  return (
    <>
      <h1>Buku tamu.</h1>
      {!items ? <div className="card">Database belum terhubung.</div> : !items.length ? <p className="mu">Belum ada pesan.</p> : (
        <table className="tbl">
          <thead><tr><th>Status</th><th>Pesan</th><th /></tr></thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id}>
                <td>{e.status === "pending" ? <span className="chip">Menunggu</span> : e.status === "approved" ? "Tampil" : "Disembunyikan"}</td>
                <td><b>{e.name}</b> <span className="mu">· {fmt.format(e.createdAt)}</span><br />{e.message}</td>
                <td className="row">
                  {e.status !== "approved" && <form action={moderateGuestbook.bind(null, e.id, "approved")}><button className="btn s">Setujui</button></form>}
                  {e.status !== "hidden" && <form action={moderateGuestbook.bind(null, e.id, "hidden")}><button className="btn o s">Sembunyikan</button></form>}
                  <form action={deleteGuestbook.bind(null, e.id)}><button className="btn o s">Hapus</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
