import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin itself (login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = req.cookies.get("token")?.value;

    // No token → block access
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // ✅ Token exists → allow
    // DO NOT verify JWT here (Edge runtime limitation)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
