import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    if (user.status !== "Active")
      return NextResponse.json({ error: "Account inactive", status: 403 });
    if (!["Admin", "Staff"].includes(user.role))
      return NextResponse.json({ error: "Not authorized", status: 403 });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    if (user.isFirstLogin) {
      return NextResponse.json({ firstLogin: true, userId: user._id });
    }

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Set JWT as HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      userId: user._id,
      role: user.role,
    });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
      secure: process.env.NODE_ENV === "production", // only secure on prod
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
