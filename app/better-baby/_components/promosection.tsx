"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PromoSection() {
  return (
    <section className="bg-[#F7F5F2] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* 🔥 IMAGE SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full items-center h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/1.png" // 👈 replace with your image
              alt="Promo"
              fill
              className="object-cover hover:scale-105 transition duration-700"
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>

          {/* 🔥 TEXT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Tag */}
            <span className="bg-[#C6B6A6] text-white text-xs px-4 py-1 inline-block">
              Limited Offer
            </span>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F0F0F] leading-snug">
              Comfort Meets <br /> Luxury for Your Baby
            </h2>

            {/* Description */}
            <p className="text-[#A38F7B] leading-relaxed">
              Discover our premium baby collection designed for safety, comfort,
              and style. Built with love for modern parents.
            </p>

            {/* Price highlight */}
            {/* <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#0F0F0F]">$199.00</span>
              <span className="text-sm text-gray-400 line-through">
                $249.00
              </span>
            </div> */}

            {/* CTA */}
            <Link
              href="/kiosk"
              className="inline-block bg-[#A38F7B] text-white px-6 py-3 rounded-full hover:bg-[#8E7A66] transition"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
