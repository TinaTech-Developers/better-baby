"use client";

import { motion } from "framer-motion";
import AdminLayout from "../_components/layout";
import { useEffect, useState } from "react";
import toast from "../../kiosk/components/toast"; // your existing toast

interface Stat {
  title: string;
  value: number;
}

interface Activity {
  id: string;
  action: string;
  item: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([
    { title: "Total Clients", value: 0 },
    { title: "Products in Shop", value: 0 },
    { title: "Low Stock Items", value: 0 },
    { title: "Categories", value: 0 },
  ]);

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users/clients
        const usersRes = await fetch("/api/admin/users");
        if (!usersRes.ok) {
          const text = await usersRes.text();
          console.error("Users fetch error:", text);
          throw new Error("Failed to fetch users");
        }
        const usersData = await usersRes.json();

        const customerCount = usersData.users.filter(
          (u: any) => u.role === "Customer"
        ).length;

        // Fetch products
        const productsRes = await fetch("/api/products");
        if (!productsRes.ok) {
          const text = await productsRes.text();
          console.error("Products fetch error:", text);
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsRes.json();

        // Fetch categories (handle 404 gracefully)
        // let categoriesCount = 0;
        const uniqueCategories = new Set(
          productsData.products.map((p: any) => p.category).filter(Boolean)
        );

        const categoriesCount = uniqueCategories.size;

        // Compute low stock items
        const lowStockCount = productsData.products.filter(
          (p: any) => p.stock <= 5
        ).length;

        // Update stats
        setStats([
          { title: "Total Clients", value: customerCount },
          { title: "Products in Shop", value: productsData.products.length },
          { title: "Low Stock Items", value: lowStockCount },
          { title: "Categories", value: categoriesCount },
        ]);

        // Generate recent activity (latest 5 product changes)
        const activity = productsData.products
          .sort(
            (a: any, b: any) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5)
          .map((p: any) => ({
            id: p._id,
            action:
              p.updatedAt === p.createdAt
                ? "Added new product"
                : "Updated product",
            item: p.name,
            time: new Date(p.updatedAt).toLocaleString(),
          }));

        setRecentActivity(activity);
      } catch (err: any) {
        console.error(err);
        toast(err.message || "Failed to load dashboard");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-400 mt-1">
            Overview of your shop and products
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-[#121212] border border-white/10 rounded-2xl p-6"
            >
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity */}
          <div className="lg:col-span-2 bg-[#121212] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-white/10 pb-3 last:border-none"
                  >
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-gray-400">{item.item}</p>
                    </div>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No recent activity</p>
              )}
            </div>
          </div>

          {/* Client View */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Client View</h3>

            <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] rounded-xl text-gray-500 text-sm">
              Product showcase preview
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
