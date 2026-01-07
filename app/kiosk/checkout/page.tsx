"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { FaPlus, FaMinus } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import TopNavigation from "../components/topnavigation";

/* ---------------- TYPES ---------------- */

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    currency: string;
    image?: string;
  };
  quantity: number;
}

interface Customer {
  fullName: string;
  email: string;
  phone: string;
}

/* ---------------- PAGE ---------------- */

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [showPayNow, setShowPayNow] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  /* ---------------- LOAD CART ---------------- */

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  /* ---------------- HELPERS ---------------- */

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  /* ---------------- PAYNOW ---------------- */

  const handlePayNow = async () => {
    if (!customer.fullName || !customer.email || !customer.phone) {
      alert("Please enter your details before payment.");
      return;
    }

    if (cart.length === 0) return;

    const res = await fetch("/api/paynow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        items: cart,
        subtotal,
        vat,
        total: total.toFixed(2),
      }),
    });

    const data = await res.json();

    setPaymentLink(data.paymentLink);
    localStorage.setItem("orderId", data.orderId);
    setShowPayNow(true);
  };

  const handleConfirmOrder = async () => {
    setOrderPlaced(true);

    localStorage.removeItem("cart");
    setCart([]);

    setTimeout(() => {
      setOrderPlaced(false);
      setShowPayNow(false);
    }, 4000);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {orderPlaced && <Confetti numberOfPieces={350} recycle={false} />}

      <TopNavigation
        searchTerm=""
        setSearchTerm={() => {}}
        setView={() => {}}
        setActiveCategory={() => {}}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onCartClick={() => {}}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ---------------- CART ---------------- */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Checkout</h1>

          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                  {item.product.image && (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.product.currency} {item.product.price}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => updateQuantity(item.product._id, -1)}
                      className="p-2 rounded-full bg-purple-500/20"
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.product._id, 1)}
                      className="p-2 rounded-full bg-purple-500/20"
                    >
                      <FaPlus size={12} />
                    </button>

                    <span className="ml-auto font-bold text-purple-400">
                      {item.product.currency}{" "}
                      {item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ---------------- SUMMARY ---------------- */}
        <div className="sticky top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-semibold">Customer Details</h2>

            <input
              placeholder="Full Name"
              value={customer.fullName}
              onChange={(e) =>
                setCustomer({ ...customer, fullName: e.target.value })
              }
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />

            <input
              placeholder="Email"
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />

            <input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />

            <hr className="border-white/10" />

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (15%)</span>
                <span>{vat.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-purple-400">
              <span>Total</span>
              <span>{total.toFixed(2)}</span>
            </div>

            {!showPayNow ? (
              <button
                onClick={handlePayNow}
                className="w-full py-4 rounded-full bg-linear-to-r from-green-400 to-green-600 font-semibold text-lg"
              >
                Pay with PayNow
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG value={paymentLink} size={180} fgColor="#00FF88" />

                <button
                  onClick={handleConfirmOrder}
                  className="w-full py-4 rounded-full bg-purple-500 font-semibold text-lg"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
