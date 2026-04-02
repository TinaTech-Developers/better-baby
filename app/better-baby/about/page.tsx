"use client";

import Image from "next/image";
import Link from "next/link";
import FAQSection from "./_components/faqsection";
import { motion } from "framer-motion";

export default function AboutPageAnimated() {
  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/about.webp"
          alt="BetterBaby Hero"
          fill
          className="object-cover object-center opacity-80"
        />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute text-center px-6 md:px-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About BetterBaby
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
            Premium baby products crafted with love, comfort, and style for your
            little ones.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:flex md:items-center md:gap-12">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mb-10 md:mb-0"
        >
          <Image
            src="/small.jpg"
            alt="Our Story"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            BetterBaby was founded to create a modern, safe, and stylish range
            of baby products. Every item is designed with care to make parenting
            simpler and joyful.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We focus on quality, comfort, and aesthetic design. Our products are
            trusted by thousands of families worldwide and continue to grow in
            popularity.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-8"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed"
          >
            To provide parents with premium baby products that combine safety,
            comfort, and style. Every product we create is crafted to enhance
            your parenting experience while nurturing happy, healthy babies.
          </motion.p>
          <div className="flex flex-col md:flex-row md:justify-center gap-6 mt-10">
            {["Safety", "Comfort", "Style"].map((title, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6 md:w-1/3"
              >
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {title === "Safety" &&
                    "All products meet the highest safety standards for peace of mind."}
                  {title === "Comfort" &&
                    "Soft, ergonomic designs that ensure your baby's comfort."}
                  {title === "Style" &&
                    "Adorable and modern designs both parents and babies will love."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">From Our Founder</h2>
        <p className="text-gray-700 mb-6 italic leading-relaxed">
          “At BetterBaby, every product is crafted with attention to detail and
          love. We aim to make parenting effortless and beautiful.”
        </p>
        <p className="font-semibold">— Jane Doe, Founder & CEO</p>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Explore Our Collection
        </h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Browse our carefully curated baby products made with premium quality
          and love.
        </p>
        <Link
          href="/kiosk"
          className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition"
        >
          Shop Now
        </Link>
      </motion.section>

      <FAQSection />
    </main>
  );
}
