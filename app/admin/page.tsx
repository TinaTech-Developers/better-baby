"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Specific backend messages
        if (res.status === 403) {
          toast.error(data.error, { autoClose: 4000 });
        } else {
          toast.error(data.error || "Login failed", { autoClose: 3000 });
        }
        return;
      }

      // First login → force password reset
      if (data.firstLogin) {
        toast.info("First login detected! Please reset your password.", {
          autoClose: 4000,
        });
        router.push(`/admin/users/${data.userId}/edit`);
        return;
      }

      // Successful login
      toast.success("Logged in successfully!", { autoClose: 2000 });
      router.push("/admin/home");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#121212] rounded-3xl p-10 shadow-lg border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Admin Login
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Enter your credentials to access the dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full rounded-xl bg-[#1a1a1a] border border-white/20 px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/30 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm text-gray-400 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full rounded-xl bg-[#1a1a1a] border border-white/20 px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/30 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
              loading
                ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                : "bg-white text-black hover:bg-[#A89078]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Forgot password */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Forgot your password?{" "}
          <a href="#" className="text-white underline hover:text-gray-300">
            Reset it
          </a>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-10 text-xs">
          © 2026 BetterBaby. All rights reserved.
        </p>

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </motion.div>
    </div>
  );
}
