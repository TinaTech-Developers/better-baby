"use client";

import Image from "next/image";
import Link from "next/link";

export default function Promotion() {
  return (
    <section className="bg-[#F7F5F2] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* CONTAINER */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-black via-[#111] to-[#1a1a1a] p-8 md:p-12 flex items-center min-h-[320px]">
          {/* 🔥 LEFT CONTENT */}
          <div className="z-10 max-w-lg text-white">
            <span className="bg-[#C6B6A6] text-[#0F0F0F] text-xs px-3 py-1 inline-block mb-4 font-medium">
              BABY STROLLER
            </span>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              BETTER BABY <br /> LUXURY BABY STROLLER
            </h2>

            <Link
              href="/better-baby/contact"
              className="inline-block mt-6 text-sm tracking-wide hover:underline"
            >
              MAKE ENQUIRY →
            </Link>
          </div>

          {/* 🔥 DISCOUNT BADGE (BETTER POSITION) */}
          <div className="absolute top-6 left-[45%] bg-[#C6B6A6] text-[#0F0F0F] text-xs px-4 py-2 rounded-full z-20 shadow-md">
            10% OFF
          </div>

          {/* 🔥 RIGHT IMAGES */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:block">
            {/* 🌟 SOFT GLOW (DEPTH) */}
            <div className="absolute right-12 bottom-10 w-[200px] h-[200px] bg-[#C6B6A6]/20 blur-3xl rounded-full"></div>

            {/* 🔥 BABY 1 (BIGGER + MAIN FOCUS) */}
            <div className="absolute bottom-0 left-4 w-[190px] h-[260px] z-20 animate-[float_6s_ease-in-out_infinite]">
              <Image src="/1.png" alt="baby" fill className="object-contain" />
            </div>

            {/* 🔥 PRODUCT (SLIGHTLY BIGGER + SPACED) */}
            <div className="absolute right-6 bottom-0 w-[300px] h-[300px] z-10 hover:scale-105 transition duration-700">
              <Image
                src="/p10.png"
                alt="stroller"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* 🔥 PATTERN OVERLAY */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:40px_40px]" />
        </div>
      </div>

      {/* 🔥 FLOAT ANIMATION */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}
