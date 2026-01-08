import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except the login page itself
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      // Not logged in → redirect to login
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      // Optional: role check
      // if (!["Admin", "Staff"].includes(payload.role)) {
      //   return NextResponse.redirect(new URL("/unauthorized", req.url));
      // }
    } catch (err) {
      // Invalid token → redirect to login
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // all /admin/* routes
};
