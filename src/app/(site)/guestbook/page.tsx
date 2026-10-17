import GuestbookForm from "@/components/GuestbookForm";
import { listApprovedEntries } from "@/server/modules/guestbook/service";

export const revalidate = 60;
export const metadata = { title: "Guestbook" };

export default async function Guestbook() {
  const entries = await listApprovedEntries();
  const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });
  return (
    <section className="vw ent">
      <p className="ov"><i className="sq" />Log // Buku tamu</p>
      <h1>Guestbook.</h1>
      <div className="gbw">
        <div><div className="sh"><span>Tulis pesan</span></div><GuestbookForm /></div>
        <div>
          <div className="sh"><span>Pesan</span><span>{entries.length}</span></div>
          {!entries.length && <p className="mu">Belum ada pesan. Jadilah yang pertama.</p>}
          {entries.map((e, i) => (
            <div className="rw" key={i}><span className="mu">{fmt.format(e.createdAt)}</span><div><b>{e.name}</b><p>{e.message}</p></div></div>
          ))}
        </div>
      </div>
    </section>
  );
}
