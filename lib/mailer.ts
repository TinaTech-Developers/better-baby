import nodemailer from "nodemailer";
import Order from "@/models/Order";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReceiptEmail(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>R ${item.price}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <h2>Payment Successful 🎉</h2>
    <p>Thank you for your order, ${order.customer.fullName}</p>

    <p><strong>Order ID:</strong> ${order.orderId}</p>

    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <p><strong>Total Paid:</strong> R ${order.total}</p>
  `;

  await transporter.sendMail({
    from: `"My Store" <${process.env.SMTP_USER}>`,
    to: order.customer.email,
    subject: `Receipt – Order ${order.orderId}`,
    html,
  });
}
