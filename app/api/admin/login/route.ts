import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // CHECK STATUS
    if (user.status !== "Active") {
      return NextResponse.json(
        { error: "Your account is inactive. Contact an administrator." },
        { status: 403 }
      );
    }

    // CHECK ROLE
    if (!["Admin", "Staff"].includes(user.role)) {
      return NextResponse.json(
        { error: "You are not authorized to access the admin panel." },
        { status: 403 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // FIRST LOGIN → FORCE PASSWORD RESET
    if (user.isFirstLogin) {
      return NextResponse.json({
        firstLogin: true,
        userId: user._id,
      });
    }

    // JWT SECRET SAFETY CHECK
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
