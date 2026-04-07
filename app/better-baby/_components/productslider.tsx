"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function ProductSlider({ products, sliderRef }: any) {
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      const firstChild = slider.children[0] as HTMLElement;
      const cardWidth = firstChild.clientWidth;

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
        // 🔁 Reset to start
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderRef]);

  return (
    <div
      ref={sliderRef}
      className="flex overflow-x-auto scroll-smooth w-full snap-x snap-mandatory no-scrollbar"
    >
      {products.map((product: any, i: number) => (
        <div
          key={i}
          className="
            snap-start
            shrink-0
            w-full sm:w-1/2 md:w-1/3 lg:w-1/4
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

          <h4 className="text-sm text-[#0F0F0F] mt-1">{product.name}</h4>

          {/* <p className="text-[#A38F7B] font-semibold mt-1">{product.price}</p> */}
        </div>
      ))}
    </div>
  );
}
