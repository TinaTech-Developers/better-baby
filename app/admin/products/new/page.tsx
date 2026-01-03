"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "../../_components/layout";

/* ---------------- TYPES ---------------- */
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

const ALL_COLORS: ProductColor[] = [
  "Red",
  "Blue",
  "Black",
  "White",
  "Brown",
  "Beige",
  "Silver",
  "Rose Gold",
  "Dark Blue",
];

/* ---------------- PAGE ---------------- */

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [images, setImages] = useState<Record<ProductColor, string[]>>({
    Red: [],
    Blue: [],
    Black: [],
    White: [],
    Brown: [],
    Beige: [],
    Silver: [],
    "Rose Gold": [],
    "Dark Blue": [],
  });

  const toggleColor = (color: ProductColor) => {
    setColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const addImage = (color: ProductColor, url: string) => {
    if (!url) return;
    setImages((prev) => ({
      ...prev,
      [color]: [...prev[color], url],
    }));
  };

  const handleSubmit = () => {
    const product = {
      name,
      price,
      currency,
      description,
      sizes,
      colors,
      images,
    };

    console.log("NEW PRODUCT:", product);
    alert("Product created (check console)");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Add New Product</h2>
          <Link
            href="/admin/products"
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </Link>
        </div>

        <div className="space-y-10">
          {/* BASIC INFO */}
          <section className="space-y-4">
            <input
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
            />

            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="flex-1 rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
              />
              <input
                placeholder="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-32 rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
              />
            </div>
          </section>

          {/* SIZES */}
          <section>
            <h3 className="font-semibold mb-3">Sizes</h3>
            <input
              placeholder="Comma separated (e.g. S, M, L, XL)"
              onChange={(e) =>
                setSizes(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
            />
          </section>

          {/* COLORS */}
          <section>
            <h3 className="font-semibold mb-3">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {ALL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    colors.includes(color) ? "border-white" : "border-white/20"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </section>

          {/* IMAGES */}
          <section className="space-y-6">
            <h3 className="font-semibold">Images per Color</h3>

            {colors.map((color) => (
              <div key={color} className="space-y-3">
                <p className="text-sm text-gray-400">{color}</p>
                <ImageInput
                  onAdd={(url) => addImage(color, url)}
                  images={images[color]}
                />
              </div>
            ))}
          </section>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="rounded-full bg-white px-8 py-4 font-semibold text-black hover:scale-[1.02] transition"
          >
            Create Product
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------------- IMAGE INPUT ---------------- */

function ImageInput({
  onAdd,
  images,
}: {
  onAdd: (url: string) => void;
  images: string[];
}) {
  const [url, setUrl] = useState("");

  return (
    <div>
      <div className="flex gap-3">
        <input
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-2"
        />
        <button
          onClick={() => {
            onAdd(url);
            setUrl("");
          }}
          className="rounded-xl bg-[#1a1a1a] px-4"
        >
          Add
        </button>
      </div>

      {images.length > 0 && (
        <div className="mt-3 flex gap-3">
          {images.map((img) => (
            <div
              key={img}
              className="relative h-16 w-16 rounded-lg overflow-hidden"
            >
              <Image src={img} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
