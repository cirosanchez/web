import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (await verifySessionToken(token)) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Guards /admin and everything under it, except the login page itself.
  matcher: ["/admin", "/admin/((?!login).*)"],
};
