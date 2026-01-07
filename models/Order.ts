import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    customer: {
      fullName: String,
      email: String,
      phone: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    vat: Number,
    total: Number,
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "PAID", "FAILED"],
      default: "PENDING_PAYMENT",
    },
    paynowReference: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
