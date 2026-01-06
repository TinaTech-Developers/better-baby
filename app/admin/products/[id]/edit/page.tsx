"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/_components/layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  _id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  sizes: string[];
  colors: ProductColor[];
  images: Record<ProductColor, string[]>;
  createdAt?: string;
  updatedAt?: string;
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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        toast.error(`Error fetching product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <AdminLayout>Loading...</AdminLayout>;
  if (error || !product)
    return <AdminLayout>Error loading product: {error}</AdminLayout>;

  /* ---------------- HELPERS ---------------- */
  const toggleColor = (color: ProductColor) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            colors: prev.colors.includes(color)
              ? prev.colors.filter((c) => c !== color)
              : [...prev.colors, color],
          }
        : prev
    );
  };

  const updateSizes = (value: string) => {
    if (!product) return;
    setProduct({
      ...product,
      sizes: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  const addImage = (color: ProductColor, url: string) => {
    if (!product || !url) return;
    setProduct({
      ...product,
      images: {
        ...product.images,
        [color]: [...product.images[color], url],
      },
    });
    toast.success(`Image added to ${color}`);
  };

  const handleSave = async () => {
    if (!product) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update product");
      }

      const updatedProduct = await res.json();
      setProduct(updatedProduct);
      toast.success("Product updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
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
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
              placeholder="Product name"
            />

            <input
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
              placeholder="Category"
            />

            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              rows={4}
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
              placeholder="Description"
            />

            <div className="flex gap-4">
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
                className="flex-1 rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
                placeholder="Price"
              />
              <input
                value={product.currency}
                onChange={(e) =>
                  setProduct({ ...product, currency: e.target.value })
                }
                className="w-32 rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
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
              className="w-full rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-3"
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
          className="flex-1 rounded-xl bg-[#0B0B0B]
 border border-white/10 px-4 py-2"
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
