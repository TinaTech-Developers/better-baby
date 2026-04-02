"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What materials are used in BetterBaby products?",
    answer:
      "We use premium, non-toxic, and baby-safe materials in all our products to ensure comfort and safety for your little ones.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship worldwide. Shipping costs and delivery times vary depending on your location.",
  },
  {
    question: "Can I return a product if I’m not satisfied?",
    answer:
      "Absolutely! We have a 30-day return policy. Products must be in their original condition and packaging.",
  },
  {
    question: "Are your products hypoallergenic?",
    answer:
      "Yes, our products are designed to be gentle on babies’ sensitive skin and are hypoallergenic wherever applicable.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 transition"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{faq.question}</span>
              <span className="text-[#c2a882] font-bold text-2xl">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            <div
              className={`px-6 pb-4 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ?
                  "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
