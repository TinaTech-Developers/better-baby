import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // ensures MongoDB enforces uniqueness
    },

    customer: {
      fullName: { type: String, required: true },
      email: String,
      phone: { type: String, required: true },
      area: String,
      addressDetails: String,
      time: String,
    },

    paymentMethod: String,
    distanceKm: Number,
    mode: String,
    items: [
      {
        product: Object,
        quantity: Number,
      },
    ],

    subtotal: Number,
    vat: Number,
    delivery: Number,
    total: Number,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: { type: String, unique: true },
//     customer: {
//       fullName: String,
//       email: String,
//       phone: String,
//     },
//     items: [
//       {
//         productId: String,
//         name: String,
//         price: Number,
//         quantity: Number,
//       },
//     ],
//     subtotal: Number,
//     vat: Number,
//     total: Number,
//     currency: { type: String, default: "USD" },
//     status: {
//       type: String,
//       enum: ["PENDING_PAYMENT", "PAID", "FAILED"],
//       default: "PENDING_PAYMENT",
//     },
//     paynowReference: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
