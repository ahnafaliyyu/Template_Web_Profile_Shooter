import { getDict } from "@/lib/dict";
import { f } from "@/lib/fmt";
import { getLocale, titleOf } from "@/lib/params";
import { KINDS, listCredentials } from "@/server/modules/credentials/service";
import CredentialBrowser from "./CredentialBrowser";

export const revalidate = 600;
export const generateMetadata = titleOf("nCreds");

export default async function Credentials({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  const d = getDict(locale);
  const all = await listCredentials(locale);
  const kinds = KINDS.filter((k) => all.some((i) => i.kind === k));
  const items = kinds.flatMap((k) => all.filter((i) => i.kind === k)); // urutan sama dengan daftar yang tampil
  return (
    <div className="pg ent">
      <header className="ph">
        <p className="ov"><i className="sq" />{d.credsOv}</p>
        <h1>{d.credsTitle}</h1>
        <div className="chs"><span className="chip">{f(d.nRecords, items.length)}</span></div>
      </header>
      <CredentialBrowser items={items} kinds={kinds} d={d} />
      <div className="pbar">{kinds.map((k) => <span key={k}>{{ pendidikan: d.kPendidikan, sertifikat: d.kSertifikat, publikasi: d.kPublikasi, penghargaan: d.kPenghargaan }[k]} <b>{items.filter((i) => i.kind === k).length}</b></span>)}</div>
    </div>
  );
}
