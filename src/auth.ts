import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { env } from "@/server/env";

const loginOf = (profile: unknown) => (profile as { login?: string } | undefined)?.login?.toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    // Hanya akun GitHub yang terdaftar di ADMIN_GITHUB_USERS yang boleh masuk.
    signIn: ({ profile }) => {
      const login = loginOf(profile);
      return !!login && env.ADMIN_GITHUB_USERS.includes(login);
    },
    jwt: ({ token, profile }) => {
      const login = loginOf(profile);
      if (login) token.login = login;
      return token;
    },
    session: ({ session, token }) => {
      session.login = token.login as string | undefined;
      return session;
    },
  },
});
