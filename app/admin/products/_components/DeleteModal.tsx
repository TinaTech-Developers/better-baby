"use client";

import { motion } from "framer-motion";

export default function DeleteModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#121212] rounded-2xl p-6 w-full max-w-md border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4">Delete this product?</h2>
        <p className="text-gray-400 text-sm">This action cannot be undone.</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 font-semibold"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
