import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["id", "en"];

/** Alamat tanpa awalan bahasa dialihkan ke /id atau /en (cookie "lang", lalu Accept-Language). */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const saved = req.cookies.get("lang")?.value;
  const locale = saved && LOCALES.includes(saved) ? saved : /^en/i.test(req.headers.get("accept-language") ?? "") ? "en" : "id";
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!admin|api|_next|.*\\..*).*)"] };
