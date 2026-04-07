// /components/Footer.tsx

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Image
            src="/BetterBaby_Logo-removebg-preview.png"
            alt="BetterBaby"
            width={120}
            height={40}
            className="mb-4"
          />
          <p className="text-gray-400 text-sm">
            Premium baby wear designed for comfort, style, and love.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-4 text-[#C6B6A6]">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-4 text-[#C6B6A6]">Categories</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Newborn</li>
            <li>Boys</li>
            <li>Girls</li>
            <li>Accessories</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-[#C6B6A6]">Contact</h3>
          <p className="text-sm text-gray-400 mb-3">
            Order easily via WhatsApp
          </p>

          <a
            href="https://wa.me/263XXXXXXXXX"
            target="_blank"
            className="inline-block bg-[#C6B6A6] text-black px-4 py-2 rounded-full text-sm hover:opacity-90"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} BetterBaby. All rights reserved.
      </div>
    </footer>
  );
}
