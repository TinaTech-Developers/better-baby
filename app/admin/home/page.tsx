"use client";

import { motion } from "framer-motion";
import AdminLayout from "../_components/layout";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Clients", value: 42 },
    { title: "Products in Shop", value: 128 },
    { title: "Low Stock Items", value: 6 },
    { title: "Categories", value: 9 },
  ];

  const recentActivity = [
    {
      id: "1",
      action: "Added new product",
      item: "Running Sneakers",
      time: "10 mins ago",
    },
    {
      id: "2",
      action: "Updated price",
      item: "Leather Handbag",
      time: "1 hour ago",
    },
    {
      id: "3",
      action: "Viewed by client",
      item: "Smart Watch",
      time: "Yesterday",
    },
  ];

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
              {recentActivity.map((item) => (
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
              ))}
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
