"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { GrCatalog } from "react-icons/gr";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/better-baby/blog" },
    { name: "About", href: "/better-baby/about" },
    { name: "Contact", href: "/better-baby/contact" },
    { name: "Catalog", href: "/kiosk", special: true },
  ];

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* 🔝 Top Bar */}
      <div className="flex bg-[#F7F5F2] items-center justify-between px-6 py-2  mx-auto">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="flex justify-center flex-1 md:flex-none">
          <Image
            src="/BetterBaby_Logo-removebg-preview.png"
            alt="BetterBaby"
            width={70}
            height={45}
          />
        </div>

        {/* Icons */}
        <Link
          href="/kiosk"
          className="flex items-center gap-2 hover:text-[#bb965f]"
        >
          {/* <ShoppingCart className="cursor-pointer text-gray-600 hover:text-[#5B21B6] transition-colors duration-200" /> */}
          Catalog
          <GrCatalog />
        </Link>
      </div>

      {/* 🧸 Category Bar (desktop only) */}
      <nav className="hidden md:block">
        <div className="flex items-center justify-center gap-8 py-3 text-base text-gray-700">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-200 ${
                link.special ?
                  "text-white bg-gray-900 hover:bg-white hover:text-gray-900 p-2 rounded-lg "
                : "hover:text-[#F7F5F2]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Left Drawer Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setDrawerOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col mt-4 space-y-4 px-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-200 ${
                link.special ?
                  "text-red-500 bg-[#F7F5F2] p-2 rounded-lg hover:text-red-600"
                : "hover:text-[#5B21F6]"
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}
    </header>
  );
}
