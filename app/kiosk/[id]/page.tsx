"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

/* --- TYPES --- */
type ProductColor =
  | "Red"
  | "Blue"
  | "Black"
  | "White"
  | "Brown"
  | "Beige"
  | "Silver"
  | "Rose Gold"
  | "Dark Blue";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  images: Record<ProductColor, string[]>;
}

/* --- PRODUCTS DATA --- */

const products: Product[] = [
  {
    id: "1",
    name: "Running Sneakers",
    price: 120,
    currency: "USD",
    description:
      "High-performance running sneakers designed for comfort and speed. Lightweight, breathable, and perfect for daily runs or workouts.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Red", "Blue", "Black", "White"],
    images: {
      Red: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?color=red",
      ],
      Blue: ["https://ckgroup.ai/imgs/hero/trainer.webp?color=blue"],
      Black: [
        "https://thumblr.uniid.it/product/158479/57466df7be63.jpg?width=3840&format=webp&q=75?color=black",
      ],
      White: [
        "https://i.ebayimg.com/images/g/wE0AAOSwqHllUG18/s-l1200.jpg?color=white",
      ],
      Brown: [],
      Beige: [],
      Silver: [],
      "Rose Gold": [],
      "Dark Blue": [],
    },
  },
  {
    id: "2",
    name: "Leather Handbag",
    price: 250,
    currency: "USD",
    description:
      "Elegant leather handbag crafted from premium materials. Spacious, durable, and stylish for everyday use or special occasions.",
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Beige"],
    images: {
      Brown: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?color=brown",
      ],
      Black: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?color=black",
      ],
      Beige: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?color=beige",
      ],
      Red: [],
      Blue: [],
      White: [],
      Silver: [],
      "Rose Gold": [],
      "Dark Blue": [],
    },
  },
  {
    id: "3",
    name: "Men’s Denim Jacket",
    price: 180,
    currency: "USD",
    description:
      "Classic men’s denim jacket with a modern fit. Durable, comfortable, and perfect for layering in any season.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Dark Blue", "Black"],
    images: {
      Blue: [
        "https://images.unsplash.com/photo-1543076447-215ad9ba6923?color=blue",
      ],
      "Dark Blue": [
        "https://images.unsplash.com/photo-1520975691300-32c57c9f92d3?color=darkblue",
      ],
      Black: [
        "https://images.unsplash.com/photo-1520975691300-32c57c9f92d3?color=black",
      ],
      Red: [],
      White: [],
      Brown: [],
      Beige: [],
      Silver: [],
      "Rose Gold": [],
    },
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 300,
    currency: "USD",
    description:
      "Feature-packed smart watch with fitness tracking, notifications, and customizable watch faces. Sleek design and long battery life.",
    sizes: ["One Size"],
    colors: ["Black", "Silver", "Rose Gold"],
    images: {
      Black: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?color=black",
      ],
      Silver: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?color=silver",
      ],
      "Rose Gold": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?color=rosegold",
      ],
      Red: [],
      Blue: [],
      White: [],
      Brown: [],
      Beige: [],
      "Dark Blue": [],
    },
  },
];

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;
  const product = products.find((p) => p.id === id);

  if (!product) return <div className="text-white p-10">Product not found</div>;

  // --- STATES ---
  const defaultColor: ProductColor = product.colors.includes("Blue")
    ? "Blue"
    : product.colors[0];
  const [selectedColor, setSelectedColor] =
    useState<ProductColor>(defaultColor);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images[defaultColor][0]);

  // --- HANDLERS ---
  const handleColorClick = (color: ProductColor) => {
    setSelectedColor(color);
    setMainImage(product.images[color][0]);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };
    console.log("Added to cart:", cartItem);
    alert(
      `Added ${quantity} x ${product.name} (${selectedSize}, ${selectedColor}) to cart!`
    );
  };

  const colorToBg = (color: ProductColor) => {
    switch (color) {
      case "Black":
        return "bg-black border-white";
      case "White":
        return "bg-white border-gray-300";
      case "Red":
        return "bg-red-600 border-white";
      case "Blue":
        return "bg-blue-600 border-white";
      default:
        return "bg-gray-500 border-white/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 lg:px-24 py-16">
      {/* BACK */}
      <Link
        href="/kiosk"
        className="inline-flex items-center mb-10 text-sm text-gray-400 hover:text-white"
      >
        ← Back to products
      </Link>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* IMAGE GALLERY */}
        <div>
          <div className="relative aspect-square rounded-3xl bg-[#0b0b0b]">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain p-16"
              priority
            />
          </div>

          {/* THUMBNAILS */}
          <div className="mt-4 flex gap-3">
            {product.images[selectedColor].map((img) => (
              <div
                key={img}
                className={`relative h-20 w-20 rounded-xl border ${
                  img === mainImage ? "border-white" : "border-white/10"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-contain p-3 cursor-pointer"
                  onClick={() => setMainImage(img)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            ${product.price}.00 {product.currency}
          </p>
          <p className="mt-6 max-w-xl text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* OPTIONS */}
          <div className="mt-10 space-y-8">
            {/* SIZE */}
            <div>
              <p className="mb-2 text-sm text-gray-400">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm hover:border-white transition ${
                      selectedSize === size ? "border-white" : "border-white/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <p className="mb-2 text-sm text-gray-400">Color</p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => handleColorClick(color)}
                    className={`h-6 w-6 rounded-full border transition ${
                      selectedColor === color
                        ? "ring-2 ring-white"
                        : "border-white/30"
                    } ${colorToBg(color)}`}
                  />
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p className="mb-2 text-sm text-gray-400">Quantity</p>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 rounded-md bg-[#0b0b0b] border border-white/20 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-12 w-full rounded-full bg-white px-6 py-4 text-black font-semibold hover:scale-[1.02] transition active:scale-95"
          >
            Add to Cart
          </button>

          {/* INFO */}
          <div className="mt-8 text-sm text-gray-500 space-y-2">
            <p>• Free shipping worldwide</p>
            <p>• 30-day return policy</p>
            <p>• Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
