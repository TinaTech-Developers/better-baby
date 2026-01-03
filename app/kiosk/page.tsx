"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Shoes", "Bags", "Clothing", "Accessories"];

const products = [
  {
    id: "1",
    name: "Running Sneakers",
    category: "Shoes",
    price: "$120",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    badge: "New",
  },
  {
    id: "2",
    name: "Leather Handbag",
    category: "Bags",
    price: "$250",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    badge: "Hot",
  },
  {
    id: "3",
    name: "Men’s Denim Jacket",
    category: "Clothing",
    price: "$180",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
  },
  {
    id: "4",
    name: "Smart Watch",
    category: "Accessories",
    price: "$300",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
];

export default function KioskPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"home" | "store">("home");

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0b0b0b]/80 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-6 px-6 py-4">
          <Link href="/kiosk" className="text-xl font-semibold tracking-wide">
            BetterBaby
          </Link>

          <div className="relative ml-auto w-full max-w-md">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full bg-[#1a1a1a] px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
            {searchTerm && filteredProducts.length > 0 && (
              <ul className="absolute bg-[#1a1a1a] mt-1 rounded-md w-full z-10 border border-white/20 max-h-60 overflow-auto">
                {filteredProducts.slice(0, 5).map((p) => (
                  <li
                    key={p.id}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  >
                    <Link href={`/kiosk/${p.id}`}>{p.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* HOME VIEW */}
      {view === "home" && (
        <>
          {/* Hero */}
          <section className="relative h-[70vh] flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
              alt="Hero"
              fill
              className="object-cover opacity-40"
            />
            <div className="relative z-10 max-w-2xl text-center px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl md:text-6xl font-bold leading-tight"
              >
                Discover Products <br /> Made for You
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-6 text-lg text-gray-300"
              >
                Browse premium items curated for quality, design and comfort.
              </motion.p>

              <div className="mt-10 flex justify-center gap-4">
                <button
                  onClick={() => setView("store")}
                  className="rounded-full bg-white px-8 py-4 text-black font-semibold hover:scale-105 transition"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="px-6 py-16">
            <h3 className="mb-8 text-2xl font-semibold">Featured Products</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/kiosk/${p.id}`}
                    className="rounded-2xl bg-[#121212] overflow-hidden border border-white/5 hover:border-white/20 transition group relative"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {p.badge && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{p.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* STORE VIEW */}
      {view === "store" && (
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 border-r border-white/10 px-6 py-6">
            <h2 className="mb-4 text-sm font-semibold uppercase text-gray-400">
              Collections
            </h2>

            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                      activeCategory === cat
                        ? "bg-white text-black"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/kiosk/${p.id}`}
                      className="group rounded-2xl bg-[#121212] overflow-hidden border border-white/5 hover:border-white/20 transition relative"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {p.badge && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {p.badge}
                          </span>
                        )}
                        <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1 text-xs">
                          {p.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between ">
                        <div className="p-4">
                          <h3 className="text-sm font-medium">{p.name}</h3>
                          <p className="mt-1 text-xs text-gray-400">
                            {p.category}
                          </p>
                        </div>

                        <Link
                          href={`/kiosk/${p.id}`}
                          className="absolute inset-0"
                        >
                          <span className="sr-only bg-white text-red-600 ">
                            View {p.name} details
                          </span>
                        </Link>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 col-span-full">
                  No products found.
                </p>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
