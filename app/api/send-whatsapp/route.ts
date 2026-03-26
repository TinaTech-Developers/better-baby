import twilio from "twilio";
import { NextRequest, NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM!;
const toNumber = process.env.BATTER_BABY_NUMBER!;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const msg = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: message,
    });

    return NextResponse.json({ success: true, sid: msg.sid });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
