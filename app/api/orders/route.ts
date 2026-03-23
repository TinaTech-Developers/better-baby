import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    await connectDB(); // make sure you're connected to MongoDB

    const body = await req.json();

    // Generate a unique order number
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
      orderId,
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      vat: body.vat,
      delivery: body.delivery,
      total: body.total,
      mode: body.mode,
      distanceKm: body.distanceKm,
      paymentMethod: body.paymentMethod,
    });

    return new Response(JSON.stringify({ orderId: order.orderId }), {
      status: 201,
    });
  } catch (err: any) {
    console.error("ORDER ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message, code: err.code }),
      { status: 500 },
    );
  }
}
