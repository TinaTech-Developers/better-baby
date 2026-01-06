"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TopNavigation from "../components/topnavigation";
import Toast from "../components/toast";

/* --- TYPES --- */
type ProductColor =
  | "Red"
  | "Blue"
  | "Black"
  | "White"
  | "Brown"
  | "Beige"
  | "Silver"
  | "Rose Gold"
  | "Dark Blue";

interface Product {
  _id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  images: Record<ProductColor, string[]>;
}

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: ProductColor;
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  // --- PRODUCT STATES ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- UI STATES ---
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");

  // --- CART STATES ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("cart");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("cart");
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // --- FETCH PRODUCT ---
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data: Product = await res.json();
        setProduct(data);

        const defaultColor: ProductColor = data.colors.includes("Blue")
          ? "Blue"
          : data.colors[0];
        setSelectedColor(defaultColor);
        setSelectedSize(data.sizes[0]);
        setMainImage(data.images[defaultColor][0]);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        toast.error(`Error fetching product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error || !product)
    return <div className="text-white p-10">Product not found</div>;

  // --- HANDLERS ---
  const handleColorClick = (color: ProductColor) => {
    setSelectedColor(color);
    setMainImage(product.images[color][0]);
  };

  const addToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product._id === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success("Added to cart!");
      setTimeout(() => toast.dismiss(), 2000);

      return [
        ...prev,
        {
          product,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
      ];
    });
  };

  const increaseQty = (id: string) =>
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  const decreaseQty = (id: string) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.product._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  const removeItem = (id: string) =>
    setCart((prev) => prev.filter((item) => item.product._id !== id));

  const colorToBg = (color: ProductColor) => {
    switch (color) {
      case "Black":
        return "bg-black border-white";
      case "White":
        return "bg-white border-gray-300";
      case "Red":
        return "bg-red-600 border-white";
      case "Blue":
        return "bg-blue-600 border-white";
      default:
        return "bg-gray-500 border-white/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* --- TOP NAVIGATION --- */}
      <TopNavigation
        searchTerm=""
        setSearchTerm={() => {}}
        setView={() => {}}
        setActiveCategory={() => {}}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <div className="px-6 lg:px-24 py-8">
        {/* BACK */}
        <Link
          href="/kiosk"
          className="inline-flex items-center mb-10 text-sm text-gray-200 hover:text-white"
        >
          {"<<"} Back to products
        </Link>

        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* IMAGE GALLERY */}
          <div>
            <div
              className="relative aspect-square rounded-3xl bg-[#0B0B0B]
"
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain p-16"
                priority
              />
            </div>

            {/* THUMBNAILS */}
            <div className="mt-4 flex gap-3">
              {selectedColor &&
                product.images[selectedColor].map((img) => (
                  <div
                    key={img}
                    className={`relative h-20 w-20 rounded-xl border ${
                      img === mainImage ? "border-white" : "border-white/10"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-contain p-3 cursor-pointer"
                      onClick={() => setMainImage(img)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold tracking-tight text-[#a59186]">
              {product.name}
            </h1>
            <p className="mt-3 text-xl text-gray-300">
              ${product.price}.00 {product.currency}
            </p>
            <p className="mt-6 max-w-xl text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* OPTIONS */}
            <div className="mt-10 space-y-8">
              {/* SIZE */}
              <div>
                <p className="mb-2 text-sm text-gray-400">Size</p>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-4 py-2 text-sm hover:border-white transition ${
                        selectedSize === size
                          ? "border-white"
                          : "border-white/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOR */}
              <div>
                <p className="mb-2 text-sm text-gray-400">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      title={color}
                      onClick={() => handleColorClick(color)}
                      className={`h-6 w-6 rounded-full border transition ${
                        selectedColor === color
                          ? "ring-2 ring-white"
                          : "border-white/30"
                      } ${colorToBg(color)}`}
                    />
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div>
                <p className="mb-2 text-sm text-gray-400">Quantity</p>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 rounded-md bg-[#0B0B0B]
 border border-white/20 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={addToCart}
              className="mt-12 w-full rounded-full bg-[#a59186] hover:bg-white px-6 py-4 text-black font-semibold hover:scale-[1.02] transition active:scale-95"
            >
              Add to Cart
            </button>

            {/* INFO */}
            <div className="mt-8 text-sm text-gray-500 space-y-2">
              <p>• Free shipping worldwide</p>
              <p>• 30-day return policy</p>
              <p>• Secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CART SIDEBAR --- */}
      {cartOpen && (
        <div className="fixed inset-0 z-40">
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">Your Cart</h2>
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
                            : "/placeholder.png"
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
                      <p className="text-xs text-gray-400">
                        Size: {item.size}, Color: {item.color}
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
                        <button
                          onClick={() => removeItem(item.product._id)}
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
                <span>
                  {cart
                    .reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>VAT (15%)</span>
                <span>
                  {(
                    cart.reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    ) * 0.15
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white font-semibold pt-2">
                <span>Total</span>
                <span>
                  {(
                    cart.reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    ) * 1.15
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <div className="px-6 py-4">
              <Link
                href="/kiosk/checkout"
                onClick={() => setCartOpen(false)}
                className={`block text-center rounded-full py-3 font-semibold transition ${
                  cart.length === 0
                    ? "bg-gray-600 text-gray-300 pointer-events-none"
                    : "bg-white text-black hover:opacity-90"
                }`}
              >
                Proceed to Checkout
              </Link>
            </div>
          </motion.aside>
        </div>
      )}

      <Toast toast={null} />
    </div>
  );
}
