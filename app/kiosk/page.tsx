"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import TopNavigation from "./components/topnavigation";
import Toast from "./components/toast";
import HeroSection from "./components/herosection";

/* ---------------- TYPES ---------------- */
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  isNew?: boolean;
  images?: Record<string, string[]>;
}

interface CartItem {
  product: Product;
  quantity: number;
}

/* ---------------- PAGE ---------------- */
export default function KioskPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  /* ---------------- CART COUNT ---------------- */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ---------------- VAT CALCULATION ---------------- //
  const VAT_RATE = 0.15;

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const vatAmount = cartSubtotal * VAT_RATE;
  const cartTotal = cartSubtotal + vatAmount;

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- LOAD CART FROM LOCAL STORAGE ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (!stored) return;

    try {
      const parsed: CartItem[] = JSON.parse(stored);

      const cleaned = parsed.filter(
        (item) => item?.product && item.product._id
      );

      setCart(cleaned);
    } catch {
      localStorage.removeItem("cart");
    }
  }, []);

  /* ---------------- SAVE CART TO LOCAL STORAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ---------------- CATEGORIES ---------------- */
  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => p.category && unique.add(p.category));
    return ["All", ...Array.from(unique)];
  }, [products]);

  /* ---------------- FILTER ---------------- */
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = (product?: Product) => {
    if (!product || !product._id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product?._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      setToast("Added to cart");
      setTimeout(() => setToast(null), 2000);

      return [...prev, { product, quantity: 1 }];
    });
  };

  // ---------------- INCREASE CART COUNT ---------------- //
  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product?._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ---------------- DECREASE CART COUNT ---------------- //
  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product?._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0 && item.product)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== id));
  };

  // ---------------- WISHLIST LOAD/SAVE ---------------- //
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // ---------------- SAVE WISHLIST ---------------- //
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setToast("Saved to wishlist");
    setTimeout(() => setToast(null), 2000);
  }, [wishlist]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#0B0B0B]
 text-white"
      >
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <>
      <TopNavigation
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setView={setView}
        setActiveCategory={setActiveCategory}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <div className="bg-[#e8ebea] min-h-screen text-[#333]">
        {view === "home" && <HeroSection setView={setView} />}
        {view === "store" && <div></div>}
        {/* ---------------- STORE ---------------- */}
        {view === "store" && (
          <div className="flex">
            {/* SIDEBAR */}
            <aside className="hidden md:block w-64 border-r border-white/10 px-6 py-6 bg-white mt-1">
              <h2 className="mb-4 text-sm font-bold uppercase text-gray-900">
                Collections
              </h2>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        activeCategory === cat
                          ? "bg-[#a59186] text-black"
                          : "text-gray-800 hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* PRODUCTS */}
            <main className="flex-1 px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
                {filteredProducts.map((p, index) => {
                  const image = p.images && Object.values(p.images).flat()[0];

                  const wishlisted = wishlist[p._id];
                  return (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-3xl border border-[#eee] overflow-hidden transition-shadow hover:shadow-2xl"
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-[#F7F7F7]">
                        <Image
                          src={image || "/placeholder.png"}
                          alt={p.name}
                          fill
                          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Wishlist */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setWishlist((w) => ({ ...w, [p._id]: !w[p._id] }));
                          }}
                          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg text-[#FF6F91]"
                        >
                          {wishlisted ? "♥" : "♡"}
                        </button>

                        {/* Badge */}
                        {p.isNew && (
                          <span className="absolute top-4 left-4 text-xs font-semibold bg-black text-white px-3 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <p className="text-xs text-gray-400 uppercase mb-1">
                          {p.category}
                        </p>

                        <h3 className="text-sm font-medium text-[#1d0b02] leading-snug line-clamp-2">
                          {p.name}
                        </h3>

                        <div className="flex items-center justify-between mt-4">
                          <p className="text-base font-semibold text-gray-900">
                            {p.currency} {p.price.toFixed(2)}
                          </p>

                          <button
                            onClick={() => addToCart(p)}
                            className="opacity-0 group-hover:opacity-100 transition text-sm font-semibold text-[#FF6F91] hover:underline border border-[#FF6F91] px-5 py-1 rounded-full"
                          >
                            Add to Cart
                          </button>
                          <Link
                            href={`/kiosk/${p._id}`}
                            className="ml-2 text-sm font-semibold text-[#1d0b02] border border-[#1d0b02] px-4 py-1 rounded-full hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>

                      {/* Clickable overlay */}
                      {/* <Link href={`/kiosk/${p._id}`} className="absolute inset-0" /> */}
                    </motion.div>
                  );
                })}
              </div>
            </main>
          </div>
        )}
        {/* CART SIDEBAR */}
        {cartOpen && (
          <div className="fixed inset-0 z-40">
            {/* Overlay */}
            <div
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/60"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="
        absolute right-0 top-0 h-full w-full max-w-md
        bg-gray-800 text-white
        border-l border-white/10
        flex flex-col
      "
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-sm">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex gap-4 border-b border-white/10 pb-4"
                    >
                      <div className="relative h-16 w-16 bg-[#111] rounded-md overflow-hidden">
                        <Image
                          src={
                            item.product.images
                              ? Object.values(item.product.images).flat()[0]
                              : "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {item.product.currency} {item.product.price}
                        </p>

                        {/* Controls */}
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => decreaseQty(item.product._id)}
                            className="h-7 w-7 rounded border border-white/20"
                          >
                            −
                          </button>

                          <span className="text-sm">{item.quantity}</span>

                          <button
                            onClick={() => increaseQty(item.product._id)}
                            className="h-7 w-7 rounded border border-white/20"
                          >
                            +
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() =>
                              setCart((prev) =>
                                prev.filter(
                                  (i) => i.product._id !== item.product._id
                                )
                              )
                            }
                            className="ml-auto text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 px-6 py-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{cartSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>VAT (15%)</span>
                  <span>{vatAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white font-semibold pt-2">
                  <span>Total</span>
                  <span>{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4">
                <Link
                  href="/kiosk/checkout"
                  onClick={() => setCartOpen(false)}
                  className={`
            block text-center rounded-full py-3 font-semibold transition
            ${
              cart.length === 0
                ? "bg-gray-600 text-gray-300 pointer-events-none"
                : "bg-white text-black hover:opacity-90"
            }
          `}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </div>
      {/* TOAST */}
      <Toast toast={toast} />
    </>
  );
}
