"use client";
import { useActionState } from "react";
import { errMsg, type Dict } from "@/lib/dict";
import { sendContact } from "@/server/modules/contact/actions";
import type { GbState } from "@/server/modules/guestbook/actions";

export default function ContactForm({ d }: { d: Dict }) {
  const [state, action, pending] = useActionState<GbState, FormData>(sendContact, {});
  if (state.ok) return <p className="fm-ok">{d.thanksContact}</p>;
  return (
    <form className="fm" action={action}>
      <div className="f2">
        <label>{d.fName}<input name="name" maxLength={80} required autoComplete="name" /></label>
        <label>{d.fEmail}<input name="email" type="email" maxLength={160} required autoComplete="email" /></label>
      </div>
      <label>{d.fSubject}<input name="subject" maxLength={160} required /></label>
      <label>{d.fMsg}<textarea name="message" rows={6} maxLength={2000} required /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.error && <p className="fm-err" role="alert">{errMsg(d, state.error)}</p>}
      <button className="btn" data-t disabled={pending}>{pending ? d.sending : d.send}</button>
    </form>
  );
}
