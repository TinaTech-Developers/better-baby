import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/Order";
import { sendReceiptEmail } from "@/lib/mailer";
import { connectDB } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { reference, status } = await req.json();

    const order = await Order.findOne({ orderId: reference });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (status === "PAID") {
      order.status = "PAID";
      await order.save();

      await sendReceiptEmail(order);

      return NextResponse.json({ success: true });
    }

    order.status = "FAILED";
    await order.save();

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
