"use client";

import { useParams } from "next/navigation";
import AdminLayout from "../../_components/layout";

export default function EditProductPage() {
  const { id } = useParams();

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
        <p className="text-gray-400 mb-6">Editing product ID: {id}</p>

        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4">
          <input className="input" placeholder="Product name" />
          <input className="input" placeholder="Category" />
          <input type="number" className="input" placeholder="Price" />
          <input type="number" className="input" placeholder="Stock" />

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-4 py-2 rounded-xl bg-white/10">Cancel</button>
            <button className="px-4 py-2 rounded-xl bg-white text-black font-semibold">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
