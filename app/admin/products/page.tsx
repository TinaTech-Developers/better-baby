"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../_components/layout";

/* ---------------- MOCK DATA ---------------- */

const products = [
  {
    id: "1",
    name: "Running Sneakers",
    category: "Shoes",
    price: 120,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
  {
    id: "2",
    name: "Leather Handbag",
    category: "Bags",
    price: 250,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  },
];

/* ---------------- PAGE ---------------- */

export default function AdminProductsPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Products</h2>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2 font-semibold hover:opacity-90 transition"
        >
          <FiPlus />
          Add Product
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-400">{product.category}</p>

              <div className="mt-3 flex justify-between items-center">
                <p className="text-xl font-bold">${product.price}</p>
                <span className="text-sm text-gray-400">
                  Stock: {product.stock}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] rounded-xl py-2 text-sm hover:bg-white/10 transition"
                >
                  <FiEdit />
                  Edit
                </Link>

                <button
                  onClick={() => setDeleteId(product.id)}
                  className="rounded-xl bg-red-600/20 hover:bg-red-600 px-3 py-2 transition text-red-400 hover:text-white"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADD PRODUCT MODAL */}
      {openAdd && (
        <Modal onClose={() => setOpenAdd(false)} title="Add Product">
          <p className="text-gray-400 text-sm">
            Product creation form goes here.
          </p>

          <button
            onClick={() => setOpenAdd(false)}
            className="mt-6 rounded-lg bg-white text-black px-6 py-2 font-semibold"
          >
            Close
          </button>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <Modal onClose={() => setDeleteId(null)} title="Delete Product">
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete this product?
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-lg bg-[#1a1a1a] py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Delete product:", deleteId);
                setDeleteId(null);
              }}
              className="flex-1 rounded-lg bg-red-600 py-2"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

/* ---------------- MODAL COMPONENT ---------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#121212] rounded-2xl p-6 w-full max-w-md border border-white/10"
      >
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {children}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
}
