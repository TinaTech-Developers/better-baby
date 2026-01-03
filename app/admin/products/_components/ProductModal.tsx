"use client";

import { motion } from "framer-motion";

export default function ProductModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#121212] rounded-2xl p-6 w-full max-w-lg border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>

        <div className="space-y-3">
          <input className="input" placeholder="Product name" />
          <input className="input" placeholder="Category" />
          <input className="input" placeholder="Price" type="number" />
          <input className="input" placeholder="Stock" type="number" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-xl bg-white text-black font-semibold">
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
