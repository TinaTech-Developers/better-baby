"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/_components/layout";

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

interface Product {
  name: string;
  price: number;
  currency: string;
  description: string;
  sizes: string[];
  colors: ProductColor[];
  images: Record<ProductColor, string[]>;
}

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

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product>({
    name: "Running Sneakers",
    price: 120,
    currency: "USD",
    description:
      "High-performance running sneakers designed for comfort and speed.",
    sizes: ["6", "7", "8", "9"],
    colors: ["Red", "Blue"],
    images: {
      Red: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
      Blue: ["https://ckgroup.ai/imgs/hero/trainer.webp"],
      Black: [],
      White: [],
      Brown: [],
      Beige: [],
      Silver: [],
      "Rose Gold": [],
      "Dark Blue": [],
    },
  });

  /* ---------------- HELPERS ---------------- */

  const toggleColor = (color: ProductColor) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const updateSizes = (value: string) => {
    setProduct({
      ...product,
      sizes: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  const addImage = (color: ProductColor, url: string) => {
    if (!url) return;
    setProduct((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [color]: [...prev.images[color], url],
      },
    }));
  };

  const handleSave = () => {
    console.log("UPDATED PRODUCT:", { id, ...product });
    alert("Product updated (check console)");
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Edit Product <span className="text-gray-400">#{id}</span>
          </h2>
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
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
              placeholder="Product name"
            />

            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              rows={4}
              className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
              placeholder="Description"
            />

            <div className="flex gap-4">
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
                className="flex-1 rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
                placeholder="Price"
              />
              <input
                value={product.currency}
                onChange={(e) =>
                  setProduct({ ...product, currency: e.target.value })
                }
                className="w-32 rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
                placeholder="Currency"
              />
            </div>
          </section>

          {/* SIZES */}
          <section>
            <h3 className="font-semibold mb-3">Sizes</h3>
            <input
              defaultValue={product.sizes.join(", ")}
              onChange={(e) => updateSizes(e.target.value)}
              className="w-full rounded-xl bg-[#0b0b0b] border border-white/10 px-4 py-3"
              placeholder="Comma separated (e.g. S, M, L, XL)"
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
                    product.colors.includes(color)
                      ? "border-white"
                      : "border-white/20"
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

            {product.colors.map((color) => (
              <div key={color} className="space-y-3">
                <p className="text-sm text-gray-400">{color}</p>
                <ImageInput
                  onAdd={(url) => addImage(color, url)}
                  images={product.images[color]}
                />
              </div>
            ))}
          </section>

          {/* SAVE */}
          <button
            onClick={handleSave}
            className="rounded-full bg-white px-8 py-4 font-semibold text-black hover:scale-[1.02] transition"
          >
            Save Changes
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
