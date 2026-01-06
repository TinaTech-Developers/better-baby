import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json();

    if (!amount || !description) {
      return NextResponse.json(
        { error: "Amount and description required" },
        { status: 400 }
      );
    }

    // Mock PayNow payment link
    const merchantCode = "YOUR_MERCHANT_CODE"; // replace with your code
    const paymentLink = `https://www.paynow.co.za/pay?merchant=${merchantCode}&amount=${amount}&desc=${encodeURIComponent(
      description
    )}`;

    return NextResponse.json({ paymentLink });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
