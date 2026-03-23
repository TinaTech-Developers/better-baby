"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaWhatsapp } from "react-icons/fa";

export default function CheckoutPage() {
  const { data: session } = useSession();

  const [cart, setCart] = useState<any[]>([]);
  const [mode, setMode] = useState("delivery");

  const [distanceKm, setDistanceKm] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    area: "",
    addressDetails: "",
    note: "",
    time: "",
  });

  const DELIVERY_ZONES = {
    Belvedere: 5,
    Avondale: 6,
    Borrowdale: 12,
    CBD: 4,
    Ruwa: 15,
  };

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // ✅ Auto-fill
  useEffect(() => {
    if (!session || !session.user) return;

    setCustomer((prev) => ({
      ...prev,
      fullName: session.user?.name ?? "",
      email: session.user?.email ?? "",
    }));
  }, [session]);

  /* ---------------- DISTANCE ---------------- */

  const calculateDistance = async (destination: string) => {
    if (!destination) return;

    const res = await fetch("/api/distance", {
      method: "POST",
      body: JSON.stringify({
        origin: "Emerald Hill, Harare",
        destination,
      }),
    });

    const data = await res.json();
    setDistanceKm(data.distanceKm || 0);
  };

  /* ---------------- TOTALS ---------------- */

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const vat = subtotal * 0.15;
  const deliveryFee = mode === "delivery" ? distanceKm * 0.4 : 0;
  const total = subtotal + vat + deliveryFee;

  /* ---------------- ORDER ---------------- */

  const handleOrder = async () => {
    if (!customer.fullName || !customer.phone) {
      alert("Fill required fields");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer,
        items: cart,
        subtotal,
        vat,
        delivery: deliveryFee,
        total,
        mode,
        distanceKm,
        paymentMethod,
      }),
    });

    if (!res.ok) {
      alert("Order Failed");
      return;
    }
    const data = await res.json();

    if (!data.orderId) {
      alert("Order not created");
      return;
    }

    const itemsText = cart
      .map(
        (item) =>
          `- ${item.product.name} x${item.quantity} (${item.product.currency} ${
            item.product.price * item.quantity
          })`,
      )
      .join("\n");

    const message = `
*New Order* 🛒
*Order No*: ${data.orderId}

*Type*: ${mode.toUpperCase()}

*Name*: ${customer.fullName}
*Phone*: ${customer.phone}
*Email*: ${customer.email}

${
  mode === "delivery" ?
    `*Area*: ${customer.area}
*Address*: ${customer.addressDetails}
*Distance*: ${distanceKm.toFixed(2)} km`
  : `*Pickup*: Emerald Hill`
}

*Time*: ${customer.time}

*Items*:
${itemsText}
*Payment*: ${paymentMethod.toUpperCase()}

*Subtotal*: ${subtotal.toFixed(2)}
*Delivery*: ${deliveryFee.toFixed(2)}
*Total*: ${total.toFixed(2)}
`;

    window.open(
      `https://wa.me/263712471209?text=${encodeURIComponent(message)}`,
      "_blank",
    );

    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <div className="max-w-2xl mx-auto p-5 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Checkout</h1>

        {/* TOGGLE */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setMode("delivery")}
            className={`flex-1 py-2 rounded-lg ${
              mode === "delivery" ? "bg-black text-white" : "text-gray-600"
            }`}
          >
            Delivery
          </button>

          <button
            onClick={() => setMode("collection")}
            className={`flex-1 py-2 rounded-lg ${
              mode === "collection" ? "bg-black text-white" : "text-gray-600"
            }`}
          >
            Collection
          </button>
        </div>

        {/* DELIVERY */}
        {mode === "delivery" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
            <select
              className="input"
              value={customer.area}
              onChange={(e) => {
                const area = e.target.value;

                setCustomer({ ...customer, area });

                setDistanceKm(
                  DELIVERY_ZONES[area as keyof typeof DELIVERY_ZONES] || 0,
                );
              }}
            >
              <option value="">Select Area</option>
              {Object.keys(DELIVERY_ZONES).map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>

            <input
              placeholder="House / Street"
              onChange={(e) => {
                const value = e.target.value;
                setCustomer({
                  ...customer,
                  addressDetails: value,
                });

                calculateDistance(`${customer.area} ${value}`);
              }}
              className="input"
            />

            <select
              className="input"
              onChange={(e) =>
                setCustomer({ ...customer, time: e.target.value })
              }
            >
              <option value="">Select Delivery Time</option>
              <option>10:00 - 12:00</option>
              <option>12:00 - 14:00</option>
              <option>14:00 - 16:00</option>
              <option>16:00 - 17:00</option>
            </select>

            <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
              <h2 className="text-gray-800 font-medium">Payment Method</h2>

              <select
                className="input"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                <option value="ecocash">EcoCash</option>
                <option value="swipe">Swipe</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {distanceKm > 0 && (
              <p className="text-gray-600 text-sm">
                Distance: {distanceKm.toFixed(2)} km
              </p>
            )}
          </div>
        )}

        {/* COLLECTION */}
        {mode === "collection" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-gray-600">Pickup: Emerald Hill, Harare</p>

            <input
              type="time"
              onChange={(e) =>
                setCustomer({ ...customer, time: e.target.value })
              }
              className="input mt-3"
            />
          </div>
        )}

        {/* CONTACT */}
        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
          <input
            placeholder="Full Name"
            value={customer.fullName}
            onChange={(e) =>
              setCustomer({ ...customer, fullName: e.target.value })
            }
            className="input"
          />

          <input
            placeholder="Phone"
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            className="input"
          />
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>{deliveryFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-gray-800 mt-2">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleOrder}
            className="w-full bg-green-600 text-white py-4 rounded-xl flex justify-center gap-2"
          >
            Continue to WhatsApp <FaWhatsapp />
          </button>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 12px;
          border-radius: 10px;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}
