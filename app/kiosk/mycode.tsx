"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import TopNavigation from "./components/topnavigation";
import Toast from "./components/toast";
import HeroSection from "./components/herosection";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  images?: Record<string, string[]>;
  isNew?: boolean;
  onSale?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const VAT_RATE = 0.15;
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const vatAmount = cartSubtotal * VAT_RATE;
  const cartTotal = cartSubtotal + vatAmount;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed: CartItem[] = JSON.parse(stored);
        setCart(parsed);
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => p.category && unique.add(p.category));
    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return (
      matchesCategory && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const addToCart = (product?: Product) => {
    if (!product) return;
    setCart((prev) => {
      const exists = prev.find((item) => item.product._id === product._id);
      if (exists) {
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

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D5F4E6] text-[#333]">
        <p>Loading products...</p>
      </div>
    );

  return (
    <div className="bg-[#D5F4E6] min-h-screen text-[#333]">
      {/* Navigation */}
      <TopNavigation
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setView={setView}
        setActiveCategory={setActiveCategory}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Hero Section */}
      {view === "home" && <HeroSection setView={setView} />}

      {/* Store */}
      {view === "store" && (
        <main className="px-6 pt-6">
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-4 whitespace-nowrap font-semibold rounded-full transition ${
                  activeCategory === cat
                    ? "bg-[#FF6F91] text-white shadow-lg"
                    : "bg-[#7EC8E3] text-[#333] hover:bg-[#FF6F91]/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
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

                    <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
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
                        className="ml-2 text-sm font-semibold text-[#7EC8E3] hover:underline"
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
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 right-0 bg-[#D5F4E6] border-t shadow-xl z-50"
        >
          <div className="px-6 py-4 flex justify-between items-center border-b border-[#CCC]">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button onClick={() => setCartOpen(false)}>✕</button>
          </div>

          <div className="px-6 space-y-4 max-h-80 overflow-y-auto">
            {cart.length === 0 && (
              <p className="text-[#666] text-sm">Your cart is empty.</p>
            )}
            {cart.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F9F9F9]">
                  <Image
                    src={
                      item.product.images
                        ? Object.values(item.product.images).flat()[0]
                        : "/placeholder.png"
                    }
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-[#666]">
                    {item.product.currency} {item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => decreaseQty(item.product._id)}
                    className="px-2 py-1 bg-[#7EC8E3] rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.product._id)}
                    className="px-2 py-1 bg-[#FF6F91] text-white rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{cartTotal.toFixed(2)}</span>
            </div>
            <Link
              href="/kiosk/checkout"
              onClick={() => setCartOpen(false)}
              className="block text-center bg-[#FF6F91] text-white py-3 mt-3 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </motion.div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
