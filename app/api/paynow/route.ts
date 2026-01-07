import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongo";

/* ---------------- TYPES ---------------- */

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    currency: string;
  };
  quantity: number;
}

interface Customer {
  fullName: string;
  email: string;
  phone: string;
}

/* ---------------- POST ---------------- */

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      customer,
      items,
      subtotal,
      vat,
      total,
    }: {
      customer: Customer;
      items: OrderItem[];
      subtotal: number;
      vat: number;
      total: number;
    } = await req.json();

    /* -------- VALIDATION -------- */

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    if (!customer.fullName || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: "Customer details missing" },
        { status: 400 }
      );
    }

    /* -------- CREATE ORDER -------- */

    const orderId = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderId,
      customer,
      items: items.map((i) => ({
        productId: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      subtotal,
      vat,
      total,
      status: "PENDING_PAYMENT",
      paynowReference: orderId,
    });

    /* -------- PAYNOW -------- */

    const merchantCode = process.env.PAYNOW_MERCHANT_CODE!;

    const paymentLink = `https://www.paynow.co.za/pay?merchant=${merchantCode}&reference=${orderId}&amount=${total}&email=${encodeURIComponent(
      customer.email
    )}`;

    return NextResponse.json({
      orderId,
      paymentLink,
    });
  } catch (error) {
    console.error("PayNow API Error:", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
