"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* 🔝 Top Bar */}
      <div className="flex bg-[#F7F5F2] items-center justify-between px-6 py-2 max-w-7xl mx-auto">
        {/* Search */}
        {/* <div className="hidden md:flex items-center bg-[#F0E6F6] px-4 py-2 rounded-full w-1/3 transition-all duration-200 hover:shadow-md">
          <Search size={18} className="text-[#8B5CF6]" />
          <input
            type="text"
            placeholder="Search baby products..."
            className="bg-transparent outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div> */}

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/BetterBaby_Logo-removebg-preview.png"
            alt="BetterBaby"
            width={70}
            height={45}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          {/* Order Now{" "} */}
          <ShoppingCart className="cursor-pointer text-gray-600 hover:text-[#5B21B6] transition-colors duration-200" />
        </div>
      </div>

      {/* 🧸 Category Bar */}
      <nav className="">
        <div className="flex items-center justify-center gap-8 py-3 text-base text-gray-700">
          <Link
            href="#"
            className="hover:text-[#F7F5F2] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="#"
            className="hover:text-[#F7F5F2] transition-colors duration-200"
          >
            Blog
          </Link>
          <Link
            href="#"
            className="hover:text-[#F7F5F2] transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="#"
            className="hover:text-[#F7F5F2] transition-colors duration-200"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="text-red-500 bg-[#F7F5F2] p-2 rounded-lg hover:text-red-600 transition-colors duration-200"
          >
            Catalog
          </Link>
        </div>
      </nav>
    </header>
  );
}
