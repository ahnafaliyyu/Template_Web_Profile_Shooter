"use client";
import { useActionState } from "react";
import { signGuestbook, type GbState } from "@/server/modules/guestbook/actions";

export default function GuestbookForm() {
  const [state, action, pending] = useActionState<GbState, FormData>(signGuestbook, {});
  if (state.ok) return <p className="fm-ok">Terima kasih. Pesanmu menunggu persetujuan sebelum tampil.</p>;
  return (
    <form className="fm" action={action}>
      <label>Nama<input name="name" maxLength={60} required autoComplete="name" /></label>
      <label>Pesan<textarea name="message" rows={4} maxLength={500} required /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.error && <p className="fm-err" role="alert">{state.error}</p>}
      <button className="btn" data-t disabled={pending}>{pending ? "Mengirim…" : "Kirim pesan"}</button>
    </form>
  );
}
