import { signIn } from "@/auth";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="lg">
      <p className="ov" style={{ justifyContent: "center" }}><i className="sq" />Admin // Akses terbatas</p>
      <h1 style={{ border: 0, margin: 0, padding: 0, fontSize: "3rem" }}>Masuk.</h1>
      {error && <p className="fm-err" role="alert">Akun GitHub ini tidak diizinkan.</p>}
      <form action={async () => { "use server"; await signIn("github", { redirectTo: "/admin" }); }}>
        <button className="btn">Masuk dengan GitHub</button>
      </form>
    </div>
  );
}
