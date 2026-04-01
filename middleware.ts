import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./src/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("lrl_session")?.value;
  const isValid = token ? await verifySessionToken(token) : null;

  if (!isValid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
