"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const posts = [
  {
    id: "1",
    title: "5 Essential Tips for New Parents",
    image: "/5ways.jpg",
    excerpt:
      "Everything you need to know to start your parenting journey with confidence.",
    date: "March 20, 2026",
  },
  {
    id: "2",
    title: "Choosing the Right Baby Products",
    image: "/a.avif",
    excerpt:
      "A guide to selecting safe, comfortable, and stylish baby essentials.",
    date: "March 18, 2026",
  },
  {
    id: "3",
    title: "How to Create a Cozy Nursery",
    image: "/cozy.jpg",
    excerpt: "Design a warm and welcoming space for your baby.",
    date: "March 15, 2026",
  },
  // {
  //   id: "4",
  //   title: "Baby Care Basics Every Parent Should Know",
  //   image: "/cozy.jpg",
  //   excerpt: "Simple and practical baby care tips for everyday life.",
  //   date: "March 10, 2026",
  // },
];

export default function BlogPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/blog.webp"
          alt="Blog Hero"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="max-w-xl mx-auto text-white/90">
            Tips, guides, and insights to help you care for your little ones.
          </p>
        </motion.div>
      </section>
      {/* Featured Post */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[400px] rounded-2xl overflow-hidden group cursor-pointer"
        >
          <Image
            src="/blog.webp"
            alt="Featured Post"
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
              The Ultimate Guide to Baby Essentials
            </h2>
            <p className="text-white/90 max-w-lg">
              Discover everything you need to prepare for your baby’s arrival.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full h-56 overflow-hidden rounded-xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                <h3 className="font-semibold text-lg group-hover:text-red-500 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>
                <Link
                  href={`/better-baby/blog/${post.id}`}
                  className="inline-block mt-3 text-red-500 text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
