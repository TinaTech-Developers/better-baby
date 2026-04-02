"use client";

import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* 🔥 IMAGE */}
        <div className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden">
          <Image
            src="/1.png" // 👈 lifestyle image
            alt="Happy family"
            fill
            className="object-cover"
          />
        </div>

        {/* 🔥 TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F0F0F] leading-snug">
            Designed for Comfort, <br /> Built for Love
          </h2>

          <p className="text-[#A38F7B] mt-6 leading-relaxed">
            Every product we offer is carefully selected to ensure your baby’s
            comfort, safety, and happiness. We believe parenting should be
            easier, and every moment should feel special.
          </p>

          <Link
            href="/catalog"
            className="inline-block mt-6 bg-[#C6B6A6] text-[#0F0F0F] px-6 py-3 rounded-full hover:opacity-90 transition"
          >
            Explore Catalog →
          </Link>
        </div>
      </div>
    </section>
  );
}
