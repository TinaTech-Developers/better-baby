"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] bg-[url('/cantact.jpg')] bg-cover bg-center flex items-center justify-center">
        {/* Overlay (optional but makes text readable) */}
        <div className="absolute inset-0 bg-black/30"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center px-6 md:px-12 text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Have questions or need assistance? Reach out and we’ll respond as
            soon as possible.
          </p>
        </motion.div>
      </section>
      {/* Contact Form + Info */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:flex md:gap-12">
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-2/3 bg-white shadow-lg rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            required
          />
          <button
            type="submit"
            className="bg-[#525252] text-white px-6 py-3 rounded-full hover:bg-[#272424] transition font-semibold"
          >
            Send Message
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/3 mt-10 md:mt-0 space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@betterbaby.com" className="text-[#525252]">
              info@betterbaby.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href="tel:+1234567890" className="text-[#525252]">
              +263 78 610 1011
            </a>
          </p>
          <p>
            <strong>Address:</strong> 56 Five Avenue, Harare, Zimbabwe
          </p>
        </motion.div>
      </section>

      {/* Optional Map */}
      <section className="w-full h-[40vh] mt-12">
        <iframe
          className="w-full h-full border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019654812009!2d-122.42067968468106!3d37.77492977975938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064c2cbb4e5%3A0x4f6f6e3b5c1f4f0!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1695312345678!5m2!1sen!2s"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>
    </main>
  );
}
