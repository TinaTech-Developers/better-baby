"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

// Styles
import "swiper/css";
import "swiper/css/autoplay";

interface HeroSectionProps {
  setView: (view: string) => void;
}

export default function HeroSection({ setView }: HeroSectionProps) {
  const videos = [
    // "https://www.youtube.com/watch?v=pY3bF6eaodQ",
    // "https://www.w3schools.com/html/movie.mp4",
    "/Nike Air Force One - Spec Spot - by Blackfox-Media (4k).mp4",
    "/W16 TV Ad.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  ];

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Video Swiper */}
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 14000, disableOnInteraction: false }}
        className="absolute inset-0 h-full w-full z-0"
      >
        {videos.map((video, idx) => (
          <SwiperSlide key={idx}>
            <video
              src={video}
              autoPlay
              muted
              loop
              className="h-full w-full object-cover brightness-50"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Optional dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Overlay Text */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-[#f0d9b5]"
        >
          Discover Products <br /> Made for You
        </motion.h2>

        <p className="mt-6 text-lg text-gray-200 max-w-xl">
          Browse premium items curated for quality and comfort.
        </p>

        <button
          onClick={() => setView("store")}
          className="mt-10 rounded-full bg-[#a59186] text-white px-8 py-4 hover:bg-white hover:text-black font-semibold hover:scale-105 transition"
        >
          Browse All Products
        </button>
      </div>
    </section>
  );
}
