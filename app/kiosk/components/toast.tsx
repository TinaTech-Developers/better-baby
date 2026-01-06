import { motion, AnimatePresence } from "framer-motion";
import { FaSmile, FaThumbsUp } from "react-icons/fa"; // optional icons

interface ToastProps {
  toast: string | null;
}

export default function Toast({ toast }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2
            bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
            text-white
            px-6 py-3 rounded-full
            text-sm font-semibold
            shadow-2xl z-50
            flex items-center gap-2
          "
        >
          {/* You can choose either smile or thumb icon */}
          <FaSmile className="w-5 h-5 animate-bounce" />
          {toast}
          <FaThumbsUp className="w-5 h-5 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
