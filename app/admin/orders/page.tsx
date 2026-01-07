"use client";

import AdminLayout from "../_components/layout";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- TYPES ---------------- */
type PaymentMethod = "Cash" | "Card";
type OrderStatus = "PENDING_PAYMENT" | "PAID" | "FAILED";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  fullName: string;
  email: string;
  phone: string;
}
interface Order {
  _id: string;
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paynowReference: string;
  createdAt: string;
  notes?: string;
  paymentMethod?: "Cash" | "Card"; // <-- added
}

/* ---------------- PAGE ---------------- */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        const ordersArray = Array.isArray(data) ? data : data.orders ?? [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
        setFilteredOrders([]);
      });
  }, []);

  // ---------------- DELETE ORDER ----------------//
  const handleDeleteOrder = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    const deletePromise = fetch(`/api/admin/orders/${id}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      pending: "Deleting order...",
      success: "Order deleted successfully",
      error: "Failed to delete order",
    });

    try {
      const res = await deletePromise;
      if (!res.ok) return;

      setOrders((prev) => prev.filter((o) => o._id !== id));
      setFilteredOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- SEARCH & FILTER ---------------- */
  useEffect(() => {
    let filtered = Array.isArray(orders) ? [...orders] : [];
    if (search) {
      filtered = filtered.filter(
        (o) =>
          o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
          o.orderId.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [search, statusFilter, orders]);

  /* ---------------- APPROVE / MARK AS PAID ---------------- */
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/update/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- RESEND PAYNOW LINK ---------------- */
  const resendPayNowLink = async (order: Order) => {
    const resendPromise = fetch(`/api/paynow/resend/${order.orderId}`, {
      method: "POST",
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    toast.promise(resendPromise, {
      pending: "Resending PayNow link...",
      success: "PayNow link resent successfully",
      error: "Failed to resend PayNow link",
    });

    await resendPromise;
  };

  return (
    <AdminLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
      <h2 className="text-3xl font-bold mb-6">Orders Dashboard</h2>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-2xl bg-[#0B0B0B] border border-white/10 text-white placeholder-gray-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 rounded-2xl bg-[#0B0B0B] border border-white/10 text-white"
        >
          <option value="All">All Statuses</option>
          <option value="PENDING_PAYMENT">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0B0B0B] text-gray-400">
            <tr>
              <th className="px-5 py-3 text-left">Order</th>
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">Payment</th>
              <th className="px-5 py-3 text-left">Total</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="border-t border-white/10"
                >
                  <td className="px-5 py-3 font-medium">{order.orderId}</td>
                  <td className="px-5 py-3">
                    <p>{order.customer.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {order.customer.phone}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    {order.paymentMethod || "PayNow"}
                  </td>
                  <td className="px-5 py-3 font-semibold text-purple-400">
                    {order.total} {order.currency}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "PENDING_PAYMENT"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : order.status === "PAID"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-gray-400 hover:text-white"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                    {order.status === "PENDING_PAYMENT" && (
                      <button
                        onClick={() => resendPayNowLink(order)}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black"
                      >
                        Resend PayNow
                      </button>
                    )}

                    {order.status === "PENDING_PAYMENT" &&
                      order.paymentMethod === "Cash" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.orderId, "PAID")
                          }
                          className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white"
                        >
                          Approve
                        </button>
                      )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminLayout>
  );
}

/* ---------------- ORDER MODAL ---------------- */
function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const win = window.open("", "", "width=400,height=700");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Receipt ${order.orderId}</title>
          <style>
            body { font-family: Arial; margin: 0; padding: 16px; background: #fff; color: #000; }
            .center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>${receiptRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    // Convert the receipt div into a canvas
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
    } as any);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Scale image to fit page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${order.orderId}_receipt.pdf`);
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
          <div ref={receiptRef}>
            <div className="text-sm text-gray-400">
              <p>Order ID: {order.orderId}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Customer: {order.customer.fullName}</p>
              <p>Email: {order.customer.email}</p>
              <p>Phone: {order.customer.phone}</p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>
                    {order.currency} {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold pt-4 border-t border-white/10">
              <span>Total</span>
              <span>
                {order.currency} {order.total}
              </span>
            </div>

            {order.status === "PENDING_PAYMENT" && (
              <div className="mt-4 flex justify-center">
                <QRCodeSVG
                  value={`https://www.paynow.co.za/pay?reference=${order.paynowReference}`}
                  size={120}
                  fgColor="#00FF88"
                />
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handlePrint}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
