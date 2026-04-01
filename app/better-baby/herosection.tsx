"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    id: 1,
    name: "HOTMOM COCOON",
    subtitle: "2 in 1 Stroller",
    price: "$600.00",
    image: "/4.png",
    discount: "5% off",
  },
  {
    id: 2,
    name: "Luxury Baby Stroller",
    subtitle: "Comfort Ride",
    price: "$520.00",
    image: "/center.png",
    discount: "10% off",
  },
  {
    id: 3,
    name: "Premium Travel Stroller",
    subtitle: "Foldable & Light",
    price: "$450.00",
    image: "/center2.png",
    discount: "8% off",
  },
];

const sideProducts = [
  {
    id: 1,
    name: "Indy Car Seat",
    price: "$140",
    image: "/side1.webp",
  },
  {
    id: 2,
    name: "Chelino Daytona 360 All Stages Carseat",
    price: "$90",
    image: "/side2.jpg",
  },
  {
    id: 3,
    name: "Walk ‘N’ Rock Walker",
    price: "$120",
    image: "/side3.webp",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [sideCurrent, setSideCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
      setSideCurrent((prev) => (prev + 1) % sideProducts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#F7F5F2] py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.1fr_1.5fr_0.9fr] items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <div className="bg-[#A38F7B] text-white text-xs px-4 py-1 inline-block">
            100% Best Product
          </div>

          <h1 className="text-4xl leading-[56px] text-[#0F0F0F]">
            LUXURY <br /> {products[current].name}
          </h1>

          <p className="text-[#A38F7B] font-medium">
            {products[current].subtitle}
          </p>

          <h2 className="text-[32px] font-bold text-[#0F0F0F]">
            {products[current].price}
          </h2>

          <div className="w-[320px] bg-gray-200 h-2 rounded-full">
            <div className="bg-[#C6B6A6] h-2 w-[45%] rounded-full"></div>
          </div>

          <div className="flex justify-between w-[320px] text-sm text-gray-500">
            <span>Available: 0</span>
            <span>Stock: coming soon</span>
          </div>

          <Link
            href="#"
            className="inline-flex items-center gap-2 font-semibold text-[#0F0F0F] mt-2"
          >
            SHOP NOW →
          </Link>
        </div>

        {/* CENTER PRODUCT */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-[400px] h-[400px] bg-white rounded-full opacity-60"></div>

          {/* 🔥 Animated Image */}
          <div className="relative w-[520px] h-[520px] translate-x-10 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={products[current].id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={products[current].image}
                  alt="Product"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Discount */}
          <div className="absolute bottom-24 left-1/5 -translate-x-1/2 bg-[#C6B6A6] text-white text-lg shadow-xl  px-5 py-2 rounded-sm shadow-md z-20">
            {/* {products[current].discount} */}
            Sale!
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white border border-[#C6B6A6] rounded-lg p-5 h-[420px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-[#0F0F0F] font-semibold">Top Product</h3>
            <div className="flex gap-2 text-gray-400">
              <span>‹</span>
              <span>›</span>
            </div>
          </div>
          <hr className="mt-2 bg-[#F7F5F2]" />

          {/* 🔥 Animated Side Product */}
          <div className="flex flex-col items-center text-center flex-1 justify-center">
            <div className="relative w-[160px] h-[160px] mb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sideProducts[sideCurrent].id}
                  initial={{ opacity: 0, y: 20, scale: 1.05 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={sideProducts[sideCurrent].image}
                    alt="Product"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <h4 className="text-[#0F0F0F] font-medium text-sm">
              {sideProducts[sideCurrent].name}
            </h4>

            <p className="text-[#A38F7B] font-bold mt-1">
              {sideProducts[sideCurrent].price}
            </p>
          </div>

          <div>
            <div className="w-full bg-gray-200 h-1 rounded-full">
              <div className="bg-[#C6B6A6] h-1 w-[60%] rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-9 h-9 flex items-center justify-center border border-[#C6B6A6] rounded-full text-[#A38F7B] cursor-pointer hover:bg-[#A38F7B] hover:text-white transition">
              ↑
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
