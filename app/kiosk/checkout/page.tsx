"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { FaPlus, FaMinus } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import TopNavigation from "../components/topnavigation";

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

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPayNow, setShowPayNow] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const handlePayNow = async () => {
    if (cart.length === 0) return;

    const res = await fetch("/api/paynow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: (total * 1.15).toFixed(2),
        description: "Purchase from MyStore",
      }),
    });

    const data = await res.json(); // now this will work
    setPaymentLink(data.paymentLink);
    setShowPayNow(true);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      localStorage.removeItem("cart");
      setOrderPlaced(false);
      setShowPayNow(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {orderPlaced && <Confetti numberOfPieces={300} recycle={false} />}

      <TopNavigation
        searchTerm=""
        setSearchTerm={() => {}}
        setView={() => {}}
        setActiveCategory={() => {}}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
      />

      <div className="flex flex-col lg:flex-row px-6 lg:px-24 py-16 gap-10">
        {/* LEFT: Cart Items */}
        <div className="flex-1 space-y-6">
          <h1 className="text-xl md:text-2xl font-bold text-white/90 mb-6">
            Your Cart
          </h1>
          {cart.map((item) => (
            <motion.div
              key={item.product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center gap-4 p-4 rounded-3xl bg-linear-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur-md hover:scale-[1.01] transition shadow-lg"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
                {item.product.image && (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <p className="text- font-semibold">{item.product.name}</p>
                <p className="text-gray-400 text-sm">
                  {item.product.currency} {item.product.price} each
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.product._id, -1)}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition"
                  >
                    <FaMinus size={14} />
                  </button>
                  <motion.span
                    key={item.quantity}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-8 text-center font-medium text-white"
                  >
                    {item.quantity}
                  </motion.span>
                  <button
                    onClick={() => updateQuantity(item.product._id, 1)}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition"
                  >
                    <FaPlus size={14} />
                  </button>

                  <motion.span
                    key={item.quantity * item.product.price}
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="ml-auto font-bold text-purple-400 text-lg"
                  >
                    {item.product.currency} {item.product.price * item.quantity}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT: Summary & Payment */}
        <div className="w-full lg:w-96 shrink-0 sticky top-24 self-start space-y-6">
          <div className="p-6 rounded-3xl backdrop-blur-md bg-linear-to-br from-white/5 to-white/10 border border-white/10 shadow-xl flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>{total}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>VAT (15%)</span>
              <span>{(total * 0.15).toFixed(2)}</span>
            </div>
            <motion.div
              className="flex justify-between text-xl font-bold text-purple-400"
              key={total}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span>Total</span>
              <span>{(total * 1.15).toFixed(2)}</span>
            </motion.div>

            {!showPayNow ? (
              <button
                onClick={handlePayNow}
                className="mt-2 py-4 w-full rounded-full bg-gradient-to-r from-green-400 to-green-600 font-semibold text-lg text-white hover:scale-105 transition-transform shadow-2xl relative overflow-hidden"
              >
                PayNow
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-white/80 text-center">Scan QR to pay:</p>
                {paymentLink && (
                  <QRCodeSVG value={paymentLink} size={180} fgColor="#00FF88" />
                )}
                <button
                  onClick={handlePlaceOrder}
                  className="mt-4 py-4 w-full rounded-full bg-purple-500 font-semibold text-lg text-white hover:scale-105 transition-transform shadow-2xl relative overflow-hidden"
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
