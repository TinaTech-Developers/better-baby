"use client";

import AdminLayout from "../_components/layout";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */
type PaymentMethod = "Cash" | "Card";
type OrderStatus =
  | "Pending"
  | "Approved"
  | "Paid"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  paymentMethod: PaymentMethod;
  total: number;
  currency: string;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
}

/* ---------------- MOCK DATA ---------------- */

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+263 77 123 4567",
    paymentMethod: "Cash",
    total: 240,
    currency: "USD",
    status: "Pending",
    date: "2025-01-05",
    items: [{ name: "Running Sneakers", quantity: 2, price: 120 }],
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    phone: "+263 78 555 8844",
    paymentMethod: "Card",
    total: 300,
    currency: "USD",
    status: "Paid",
    date: "2025-01-06",
    items: [{ name: "Smart Watch", quantity: 1, price: 300 }],
  },
];

/* ---------------- PAGE ---------------- */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const approveCashOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Approved" } : o))
    );
  };

  const statusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      Pending: "bg-yellow-600/20 text-yellow-400",
      Approved: "bg-blue-600/20 text-blue-400",
      Paid: "bg-green-600/20 text-green-400",
      Shipped: "bg-purple-600/20 text-purple-400",
      Delivered: "bg-emerald-600/20 text-emerald-400",
      Cancelled: "bg-red-600/20 text-red-400",
    };
    return styles[status];
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8">Orders</h2>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0b0b0b] text-gray-400">
            <tr>
              <th className="px-5 py-4 text-left">Order</th>
              <th className="px-5 py-4 text-left">Customer</th>
              <th className="px-5 py-4 text-left">Payment</th>
              <th className="px-5 py-4 text-left">Total</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                className="border-t border-white/10"
              >
                <td className="px-5 py-4 font-medium">{order.id}</td>

                <td className="px-5 py-4">
                  <p>{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.phone}</p>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                    {order.paymentMethod}
                  </span>
                </td>

                <td className="px-5 py-4 font-semibold">
                  ${order.total} {order.currency}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right space-x-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-gray-400 hover:text-white"
                  >
                    View
                  </button>

                  {order.paymentMethod === "Cash" &&
                    order.status === "Pending" && (
                      <button
                        onClick={() => approveCashOrder(order.id)}
                        className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-black"
                      >
                        Approve
                      </button>
                    )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminLayout>
  );
}

/* ---------------- ORDER VIEW MODAL ---------------- */

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const win = window.open("", "", "width=300,height=600");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Receipt ${order.id}</title>
          <style>
            body { margin: 0; font-family: Arial; }
            .receipt { width: 220px; padding: 12px; font-size: 11px; }
            .center { text-align: center; }
            .row { display: flex; justify-content: space-between; margin: 4px 0; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl rounded-2xl bg-[#0f0f0f] border border-white/10"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold">Order Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* DETAILS */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-400">
            <p>Order ID: {order.id}</p>
            <p>Date: {order.date}</p>
            <p>Customer: {order.customer}</p>
            <p>Phone: {order.phone}</p>
            <p>Payment: {order.paymentMethod}</p>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold pt-4 border-t border-white/10">
            <span>Total</span>
            <span>
              ${order.total} {order.currency}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Close
          </button>
          <button
            onClick={handlePrint}
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black"
          >
            Print Receipt
          </button>
        </div>

        {/* HIDDEN RECEIPT */}
        <div className="hidden">
          <div ref={receiptRef} className="receipt">
            <div className="center bold">YOUR COMPANY</div>
            <div className="center">+263 77 000 0000</div>
            <div className="divider" />

            <div>Order: {order.id}</div>
            <div>Customer: {order.customer}</div>

            <div className="divider" />

            {order.items.map((item, i) => (
              <div key={i} className="row">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>
                  {order.currency} {item.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="divider" />
            <div className="row bold">
              <span>Total</span>
              <span>
                {order.currency} {order.total}
              </span>
            </div>

            <div className="center">Thank you!</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
