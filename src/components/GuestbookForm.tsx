"use client";
import { useActionState } from "react";
import { errMsg, type Dict } from "@/lib/dict";
import { signGuestbook, type GbState } from "@/server/modules/guestbook/actions";

export default function GuestbookForm({ d }: { d: Dict }) {
  const [state, action, pending] = useActionState<GbState, FormData>(signGuestbook, {});
  if (state.ok) return <p className="fm-ok">{d.thanksGuest}</p>;
  return (
    <form className="fm" action={action}>
      <label>{d.fName}<input name="name" maxLength={60} required autoComplete="name" /></label>
      <label>{d.fMsg}<textarea name="message" rows={5} maxLength={500} required /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.error && <p className="fm-err" role="alert">{errMsg(d, state.error)}</p>}
      <button className="btn" data-t disabled={pending}>{pending ? d.sending : d.send}</button>
    </form>
  );
}
