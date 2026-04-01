"use client";

import Image from "next/image";
import { useRef } from "react";

const products = [
  { name: "Chelino - Next to Me 2 in 1", price: "$160.00", image: "/p2.png" },
  { name: "Vivo Camp Cot", price: "$90.00", image: "/p3.png" },
  { name: "Chelino Prima Rossi Bath", price: "$170.00", image: "/p4.png" },
  {
    name: "Chelino Royal 3-in-1 High Chair",
    price: "$300.00",
    image: "/p5.png",
  },
  { name: "Chelino Deluxe Carry Cot", price: "$70.00", image: "/p6.png" },
];

export default function BestSellerSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;

    const width = sliderRef.current.clientWidth;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#F7F5F2] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* HEADER */}
        <h2 className="text-lg md:text-xl font-semibold text-[#0F0F0F] border-b-2 border-[#C6B6A6] inline-block mb-6">
          Best Seller Product
        </h2>

        {/* CONTAINER */}
        <div className=" bg-white grid grid-cols-1 md:grid-cols-[260px_1fr] overflow-hidden">
          {/* LEFT */}
          <div className="bg-[#F7F5F2] p-6 flex flex-col  justify-between relative">
            <div>
              <span className="bg-[#A38F7B] text-white text-xs px-3 py-1">
                NEW
              </span>

              <h3 className="mt-4 text-lg font-bold text-[#0F0F0F]">
                DELUXE BASSINET ELECTRIC BABY ROCKER
              </h3>

              <p className="mt-3 text-[#A38F7B] font-semibold">
                Up To <span className="text-2xl">10%</span>
              </p>
            </div>

            <div className="relative w-full h-[160px] mt-4">
              <Image
                src="/aka-removebg-preview.png"
                alt="Promo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* RIGHT CAROUSEL */}
          <div className="relative flex items-center border border-[#C6B6A6] ">
            {/* ARROWS */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 z-10 w-8 h-8 bg-white border rounded-full shadow"
            >
              ‹
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 z-10 w-8 h-8 bg-white border rounded-full shadow"
            >
              ›
            </button>

            {/* SLIDER */}
            <div
              ref={sliderRef}
              className="flex overflow-hidden scroll-smooth w-full"
            >
              {products.map((product, i) => (
                <div
                  key={i}
                  className="
                    snap-start
                    flex-shrink-0
                    w-[70%] sm:w-[45%] md:w-[33.33%] lg:w-[25%]
                    px-4 py-6 text-center
                    border-r border-[#E5E5E5]
                    last:border-none
                  "
                >
                  <span className="bg-[#A38F7B] text-white text-[10px] px-2 py-1">
                    NEW
                  </span>

                  <div className="relative w-full h-[140px] my-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="text-[#C6B6A6] text-xs">★★★★★</div>

                  <h4 className="text-sm text-[#0F0F0F] mt-1">
                    {product.name}
                  </h4>

                  <p className="text-[#A38F7B] font-semibold mt-1">
                    {product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
