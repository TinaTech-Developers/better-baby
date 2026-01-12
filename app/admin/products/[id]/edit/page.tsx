"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/_components/layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageUploadButton } from "../../new/components/ImageUploadButton";

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
  const { id } = useParams() as { id: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLayout>Loading...</AdminLayout>;
  if (!product) return <AdminLayout>Product not found</AdminLayout>;

  /* ---------------- HELPERS ---------------- */
  const toggleColor = (color: ProductColor) => {
    setProduct((p) =>
      !p
        ? p
        : {
            ...p,
            colors: p.colors.includes(color)
              ? p.colors.filter((c) => c !== color)
              : [...p.colors, color],
          }
    );
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
    setProduct({
      ...product,
      images: {
        ...product.images,
        [color]: [...product.images[color], url],
      },
    });
  };

  const removeImage = async (color: ProductColor, url: string) => {
    if (!product) return;

    // Update UI immediately
    setProduct({
      ...product,
      images: {
        ...product.images,
        [color]: product.images[color].filter((img) => img !== url),
      },
    });

    // Persist to DB
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        images: {
          ...product.images,
          [color]: product.images[color].filter((img) => img !== url),
        },
      }),
    });
  };

  const replaceImage = (
    color: ProductColor,
    oldUrl: string,
    newUrl: string
  ) => {
    setProduct({
      ...product,
      images: {
        ...product.images,
        [color]: product.images[color].map((img) =>
          img === oldUrl ? newUrl : img
        ),
      },
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Product updated");
    } catch {
      toast.error("Failed to save product");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="max-w-4xl space-y-10">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Edit Product</h2>
          <Link href="/admin/products">← Back</Link>
        </div>

        {/* BASIC INFO */}
        <section className="space-y-6 ">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Product Name</label>
            <input
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full rounded-xl bg-[#0B0B0B] border border-white/20 px-4 py-3 focus:border-white outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Category</label>
            <input
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full rounded-xl bg-[#0B0B0B] border border-white/20 px-4 py-3 focus:border-white outline-none"
              placeholder="e.g. Shoes, Watches, Clothing"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              rows={5}
              className="w-full rounded-xl bg-[#0B0B0B] border border-white/20 px-4 py-3 focus:border-white outline-none resize-none"
              placeholder="Describe the product in detail"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm text-gray-400">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
                className="w-full rounded-xl bg-[#0B0B0B] border border-white/20 px-4 py-3 focus:border-white outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">Currency</label>
              <input
                value={product.currency}
                onChange={(e) =>
                  setProduct({ ...product, currency: e.target.value })
                }
                className="w-full rounded-xl bg-[#0B0B0B] border border-white/20 px-4 py-3 focus:border-white outline-none"
                placeholder="USD"
              />
            </div>
          </div>
        </section>

        {/* SIZES */}
        <section>
          <h3>Sizes</h3>
          <input
            defaultValue={product.sizes.join(", ")}
            onChange={(e) => updateSizes(e.target.value)}
            className="w-full rounded-xl bg-[#0B0B0B] border border-white/20 px-4 py-3 focus:border-white outline-none input"
          />
        </section>

        {/* COLORS */}
        <section>
          <h3>Colors</h3>
          <div className="flex flex-wrap gap-3">
            {ALL_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => toggleColor(c)}
                className={`px-4 py-2 rounded-full border ${
                  product.colors.includes(c)
                    ? "border-white"
                    : "border-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* IMAGES */}
        <section className="space-y-6">
          <h3>Images</h3>

          {product.colors.map((color) => (
            <EditableImageInput
              key={color}
              color={color}
              images={product.images[color]}
              addImage={addImage}
              removeImage={removeImage}
              replaceImage={replaceImage}
            />
          ))}
        </section>

        <button
          onClick={handleSave}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
        >
          Save Changes
        </button>
      </div>
    </AdminLayout>
  );
}

/* ---------------- IMAGE EDITOR ---------------- */
function EditableImageInput({
  color,
  images,
  addImage,
  removeImage,
  replaceImage,
}: any) {
  const [editing, setEditing] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">{color}</p>

      <ImageUploadButton
        onClientUploadComplete={(res) =>
          res?.forEach((f) => addImage(color, f.url))
        }
      />

      <div className="flex gap-3 flex-wrap">
        {images.map((img: string) => (
          <div
            key={img}
            className="relative w-20 h-20 rounded overflow-hidden group"
          >
            <Image src={img} fill alt="" className="object-cover" />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex gap-2 items-center justify-center">
              <button
                onClick={() => {
                  setEditing(img);
                  setUrl(img);
                }}
                className="text-xs px-2 p-1 "
              >
                Edit
              </button>
              <button
                onClick={() => removeImage(color, img)}
                className="text-xs px-2 p-1  bg-red-500 rounded-full"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input flex-1"
          />
          <button
            onClick={() => {
              replaceImage(color, editing, url);
              setEditing(null);
            }}
            className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
