"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "../../_components/layout";
import { ImageUploadButton } from "./components/ImageUploadButton";
import { ClientUploadedFileData } from "uploadthing/types";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

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
  const [category, setCategory] = useState("");
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

  const handleSubmit = async () => {
    try {
      const product = {
        name,
        category: category || "Uncategorized",
        price,
        currency,
        description,
        sizes,
        colors,
        images,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to create product");
      }

      const data = await res.json();
      alert(`Product created successfully: ${data.name}`);
      console.log("Created Product:", data);

      // Reset form
      setName("");
      setCategory("");
      setPrice(0);
      setCurrency("USD");
      setDescription("");
      setSizes([]);
      setColors([]);
      setImages({
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
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
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
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
            />
            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
            />

            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="flex-1 rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
              />
              <input
                placeholder="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-32 rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
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
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
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
                <UploadThingInput
                  color={color}
                  addImage={addImage}
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

/* ---------------- UPLOADTHING INPUT ---------------- */
function UploadThingInput({
  color,
  addImage,
  images,
}: {
  color: ProductColor;
  addImage: (color: ProductColor, url: string) => void;
  images: string[];
}) {
  return (
    <div className="space-y-3">
      <ImageUploadButton
        className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl"
        onClientUploadComplete={(res) => {
          if (!res) return;
          res.forEach((file) => addImage(color, file.url));
        }}
        onUploadError={(err) => alert(`Upload failed: ${err.message}`)}
      />

      {images.length > 0 && (
        <div className="flex gap-3">
          {images.map((img) => (
            <div
              key={img}
              className="relative h-16 w-16 rounded-lg overflow-hidden"
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
