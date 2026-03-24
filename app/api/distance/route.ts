import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { destination } = await req.json();

    if (!destination) {
      return NextResponse.json(
        { error: "Destination required" },
        { status: 400 },
      );
    }

    // 🔥 Fake smart logic (replace later with Google API if needed)
    const baseDistance = Math.random() * 10 + 2;

    return NextResponse.json({
      distanceKm: Number(baseDistance.toFixed(2)),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
