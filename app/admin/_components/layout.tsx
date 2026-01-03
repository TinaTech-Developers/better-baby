"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, href: "/admin/home" },
    { name: "Products", icon: <FiBox />, href: "/admin/products" },
    { name: "Orders", icon: <FiShoppingCart />, href: "/admin/orders" },
    { name: "Users", icon: <FiUsers />, href: "/admin/users" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.25 }}
        className="bg-[#121212] border-r border-white/10 flex flex-col shrink-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <span
            className={`text-lg font-bold transition-opacity ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Admin
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white/10 rounded-md transition"
          >
            {sidebarOpen ? "‹" : "›"}
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition"
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span
                className={`whitespace-nowrap transition-opacity ${
                  sidebarOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-4 w-full hover:bg-white/10 px-4 py-2 rounded-md transition">
            <FiLogOut className="text-xl shrink-0" />
            <span
              className={`transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <input
            type="text"
            placeholder="Search..."
            className="rounded-xl bg-[#121212] px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/20 transition w-72"
          />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
