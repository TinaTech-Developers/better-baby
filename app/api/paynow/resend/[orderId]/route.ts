import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Order from "@/models/Order";

export async function POST(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { orderId } = await context.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paymentLink = `https://www.paynow.co.za/pay?reference=${order.paynowReference}`;

    return NextResponse.json({
      success: true,
      paymentLink,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to resend PayNow link" },
      { status: 500 }
    );
  }
}
