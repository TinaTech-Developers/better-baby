import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

  try {
    await connectDB();
    const { password } = await req.json();

    if (!password || password.length < 6)
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );

    const hashed = await bcrypt.hash(password, 10);

    const updated = await User.findByIdAndUpdate(
      id,
      { password: hashed, isFirstLogin: false },
      { new: true }
    ).select("-password");

    if (!updated)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      message: "Password reset successfully",
      user: updated,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
