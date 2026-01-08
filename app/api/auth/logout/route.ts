import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  // Clear the JWT cookie
  response.cookies.set({
    name: "token",
    value: "",
    path: "/", // make sure path is "/" to clear it everywhere
    maxAge: 0, // expire immediately
  });

  return response;
}
