"use client";

import Image from "next/image";

const featuredProducts = [
  {
    name: "Soft Baby Blanket",
    price: "$25.00",
    image: "/products/blanket.jpg",
  },
  { name: "Cute Baby Romper", price: "$18.00", image: "/products/romper.jpg" },
  { name: "Baby Teether Set", price: "$12.00", image: "/products/teether.jpg" },
  {
    name: "Stroller Organizer",
    price: "$30.00",
    image: "/products/stroller.jpg",
  },
  { name: "Nursery Mobile", price: "$22.00", image: "/products/mobile.jpg" },
  { name: "Baby Shoes", price: "$15.00", image: "/products/shoes.jpg" },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#FFF5F7] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featuredProducts.map((product, index) => (
            <div
              key={index}
              className="relative group overflow-hidden cursor-pointer"
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Overlay info */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-40 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
