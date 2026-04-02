"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Jane Doe",
    role: "Small Business Owner",
    message:
      "This service completely transformed my business! Highly recommend.",
    avatar: "/avatars/jane.jpg",
  },
  {
    name: "John Smith",
    role: "Entrepreneur",
    message:
      "Professional, fast, and reliable. The results speak for themselves.",
    avatar: "/avatars/john.jpg",
  },
  {
    name: "Emily Johnson",
    role: "Freelancer",
    message: "I can't imagine going back. The team exceeded all expectations!",
    avatar: "/avatars/emily.jpg",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>

        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0 bg-gray-50 p-8 rounded-xl shadow flex flex-col justify-center items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-700 mb-6 text-lg">
                "{testimonials[current].message}"
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-gray-500 text-sm">
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                current === index ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
