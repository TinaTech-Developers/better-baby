"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  setView: (v: "home" | "store") => void;
  setActiveCategory: (c: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export default function TopNavigation({
  searchTerm,
  setSearchTerm,
  setView,
  setActiveCategory,
  cartCount,
  onCartClick,
}: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-2xl backdrop-blur border-b border-white/10">
      <div className="flex items-center gap-8 px-6 py-2 max-w-7xl mx-auto">
        {/* LOGO */}
        <Link
          href="/kiosk"
          onClick={() => setView("home")}
          className="text-xl font-bold tracking-wide"
        >
          <Image
            src="/BetterBaby_Logo-removebg-preview.png"
            alt="BetterBaby Logo"
            width={100}
            height={40}
            className="object-contain "
          />
        </Link>

        {/* MAIN NAV */}
        <nav className="hidden lg:flex gap-6 text-sm text-[#a59186]">
          {[
            // "Strollers",
            // "Car Seats",
            // "Baby Wear",
            // "Accessories",
            // "Home & Living",
            // "Deals",
            // "For Mom",
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                setView("store");
                setActiveCategory(item);
              }}
              className="hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* SEARCH */}
        <div className="relative ml-auto w-full max-w-[30%]">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setView("store");
            }}
            placeholder="Search for products..."
            className="w-full rounded-full border-2 text-[#a59186] border-[#a59186] px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        {/* ICONS */}
        <div className="flex gap-4 text-gray-400 text-lg ml-4">
          {/* ❤️ Placeholder for future */}
          {/* <span className="cursor-pointer hover:text-white">❤️</span> */}

          {/* CART ICON — always visible */}
          <div
            onClick={onCartClick}
            className="relative cursor-pointer text-gray-400 hover:text-white transition"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full bg-[#a59186] text-black text-xs flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
