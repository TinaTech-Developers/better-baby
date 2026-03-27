"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
export default function CheckoutPage() {
  const { data: session } = useSession();

  const [cart, setCart] = useState<any[]>([]);
  const [mode, setMode] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [showModal, setShowModal] = useState(false); // to show/hide modal
  const [orderId, setOrderId] = useState(""); // store orderId to display

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    area: "",
    addressDetails: "",
    date: "",
    time: "",
    note: "",
  });

  // ---------------- ZONES AND PRICES ----------------
  // const DELIVERY_ZONES = {
  //   "Zone 1": {
  //     price: 4,
  //     areas: [
  //       "CBD / Avenues",
  //       "Belgravia",
  //       "Milton Park",
  //       "Avondale",
  //       "Alexandra Park",
  //       "Eastlea",
  //     ],
  //   },
  //   "Zone 2": {
  //     price: 6,
  //     areas: [
  //       "Greendale",
  //       "Mount Pleasant",
  //       "Newlands",
  //       "Highlands",
  //       "Waterfalls",
  //     ],
  //   },
  //   "Zone 3": {
  //     price: 8,
  //     areas: [
  //       "Borrowdale",
  //       "Msasa",
  //       "Msasa Park",
  //       "Hatfield",
  //       "Budiriro",
  //       "Glen View",
  //       "Glen Norah",
  //     ],
  //   },
  //   "Zone 4": {
  //     price: 10,
  //     areas: ["Chitungwiza", "Ruwa", "Epworth", "Norton"],
  //   },
  // };

  // ---------------- ZONES AND PRICES ----------------
  const AREA_TO_PRICE: Record<string, number> = {
    CBD: 3,
    AVONDALE: 5,
    EASTLEA: 5,
    BELVEDERE: 5,
    "MT PLEASANT": 6,
    "MT PLEASANT HEIGHTS": 10,
    CRANEBORNE: 5,
    "BORROWDALE VILLAGE": 7,
    "BORROWDALE BROKE": 12,
    HARTFILD: 7,
    WATERFALLS: 7,
    CHITUNGWIZA: 15,
    "GLEN V": 8,
    BUDIRIRO: 8,
    HIGHFIELD: 7,
    WARREN: 6,
    KUWADZANA: 7,
    "KUWADZANA EXT": 8,
    WESTLEA: 6,
    MADOKERO: 7,
    TYNWARD: 7,
    DZ: 8,
    SOUTHERTON: 5,
    GENORAH: 8,
    MUFAKOSE: 8,
    KAMBUZUMA: 7,
    NEWLANDS: 5,
    HIGHLANDS: 7,
    CHISIPITI: 8,
    CHISHAWASHA: 10,
    MBARE: 5,
    AVONLEA: 5,
    WESTGATE: 8,
  };

  // Flatten for easy lookup
  // const AREA_TO_PRICE: Record<string, number> = {};
  // Object.values(DELIVERY_ZONES).forEach((zone) =>
  //   zone.areas.forEach((area) => {
  //     AREA_TO_PRICE[area] = zone.price;
  //   }),
  // );

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Auto-fill user info if logged in
  useEffect(() => {
    if (!session || !session.user) return;

    setCustomer((prev) => ({
      ...prev,
      fullName: session.user?.name ?? "",
      email: session.user?.email ?? "",
    }));
  }, [session]);

  // ---------------- TOTALS ----------------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const vat = subtotal * 0.15;
  const deliveryFee =
    mode === "delivery" ? AREA_TO_PRICE[customer.area] || 0 : 0;
  const total = subtotal + deliveryFee;

  // ---------------- ORDER ----------------
  const handleOrder = async () => {
    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.date ||
      !customer.time
    ) {
      alert("Fill required fields including delivery date and time");
      return;
    }

    try {
      // 1️⃣ Create order in your database
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart,
          subtotal,
          vat,
          delivery: deliveryFee,
          total,
          mode,
          paymentMethod,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.orderId) {
        alert("Failed to create order");
        return;
      }

      // 2️⃣ Prepare WhatsApp message including orderId
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
*Order No*: ${orderData.orderId}
*Type*: ${mode.toUpperCase()}
*Name*: ${customer.fullName}
*Phone*: ${customer.phone}
${
  mode === "delivery" ?
    `*Delivery Area*: ${customer.area}
*Address*: ${customer.addressDetails}
*Delivery Fee*: ${deliveryFee.toFixed(2)}
*Delivery Date*: ${customer.date}
*Delivery Time*: ${customer.time}
${customer.note ? `*Special Instructions*: ${customer.note}` : ""}`
  : `*Pickup*: 56 Fife Avenue, Shop No.2, Harare
*Pickup Time*: ${customer.time}`
}
*Items*:
${itemsText}
*Payment Method*: ${paymentMethod.toUpperCase()}
*Subtotal*: ${subtotal.toFixed(2)}
*Delivery*: ${deliveryFee.toFixed(2)}
*Total*: ${total.toFixed(2)}
`;

      // 3️⃣ Send WhatsApp message
      const whatsappRes = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const whatsappData = await whatsappRes.json();

      if (!whatsappData.success) {
        alert("Failed to send order to WhatsApp");
        return;
      }

      // 4️⃣ Clear cart and show thank-you
      localStorage.removeItem("cart");
      setCart([]);

      setCustomer({
        fullName: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        phone: "",
        area: "",
        addressDetails: "",
        date: "",
        time: "",
        note: "",
      });
      setPaymentMethod("");
      setMode("delivery"); // or "collection", depending on default

      // Instead of alert
      setOrderId(orderData.orderId); // store the generated orderId
      setShowModal(true); // show the modal
    } catch (err) {
      console.error(err);
      alert("Something went wrong while processing your order.");
    }
  };

  // ---------------- HELPER: TODAY AND MAX DATE ----------------
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

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
              onChange={(e) =>
                setCustomer({ ...customer, area: e.target.value })
              }
            >
              <option value="">Select Area</option>
              {Object.entries(AREA_TO_PRICE).map(([area, price]) => (
                <option key={area} value={area}>
                  {area} - ${price}
                </option>
              ))}
            </select>
            <input
              placeholder="House / Street"
              className="input"
              onChange={(e) =>
                setCustomer({ ...customer, addressDetails: e.target.value })
              }
            />
            <textarea
              placeholder="Additional notes (e.g. call on arrival, gate code, etc.)"
              className="input"
              rows={3}
              value={customer.note || ""}
              onChange={(e) =>
                setCustomer({ ...customer, note: e.target.value })
              }
            />

            {/* DELIVERY DATE */}
            <input
              type="date"
              className="input"
              value={customer.date || ""}
              onChange={(e) =>
                setCustomer({ ...customer, date: e.target.value })
              }
              min={minDate}
              max={maxDate}
            />

            {/* DELIVERY TIME */}
            <select
              className="input"
              value={customer.time || ""}
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
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                <option value="ecocash">EcoCash</option>
                <option value="swipe">Swipe</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {deliveryFee > 0 && (
              <p className="text-gray-600 text-sm">
                Delivery Fee: {deliveryFee.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* COLLECTION */}
        {mode === "collection" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-gray-600">
              Pickup: 56 Fife Avenue (Cnr Leopard Takawira & Fife Avenue) Shop
              No.2, Harare
            </p>
            <input
              type="time"
              className="input mt-3"
              value={customer.time || ""}
              onChange={(e) =>
                setCustomer({ ...customer, time: e.target.value })
              }
            />
          </div>
        )}

        {/* CONTACT */}
        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
          <input
            placeholder="Full Name"
            className="input"
            value={customer.fullName}
            onChange={(e) =>
              setCustomer({ ...customer, fullName: e.target.value })
            }
          />
          <input
            placeholder="Phone"
            className="input"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
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
            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-xl"
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

      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-sm w-full text-center space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-green-600">
              Order Submitted Successfully ✅
            </h2>
            <p className="text-gray-600 text-sm">
              Thank you! Your order with ID <strong>{orderId}</strong> has been
              successfully placed and forwarded to <strong>Batter Baby</strong>.
              We will process it promptly.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
