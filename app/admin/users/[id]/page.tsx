"use client";

import AdminLayout from "../../_components/layout";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type UserRole = "Admin" | "Staff" | "Customer";
type UserStatus = "Active" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Mock fetch
const users: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `U${String(i + 1).padStart(3, "0")}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Staff", "Customer"][i % 3] as UserRole,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

const loggedInUserId = "U001";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const userData = users.find((u) => u.id === id);
  const [user, setUser] = useState(userData);

  if (!user)
    return (
      <AdminLayout>
        <p className="text-white p-10">User not found</p>
      </AdminLayout>
    );

  const updateRole = (role: UserRole) => setUser({ ...user, role });
  const updateStatus = () =>
    setUser({
      ...user,
      status: user.status === "Active" ? "Inactive" : "Active",
    });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            {user.name} {user.id === loggedInUserId && "(You)"}
          </h2>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-white/10 transition">
            <h3 className="text-xl font-semibold mb-4">User Details</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <span className="font-semibold">ID:</span> {user.id}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Role:</span>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(e.target.value as UserRole)}
                  className="bg-[#1a1a1a] px-3 py-1 rounded-lg border border-white/10 outline-none hover:border-white transition"
                >
                  <option>Admin</option>
                  <option>Staff</option>
                  <option>Customer</option>
                </select>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <button
                  onClick={updateStatus}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                    user.status === "Active"
                      ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  }`}
                >
                  {user.status}
                </button>
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-white/10 transition">
            <h3 className="text-xl font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Reset or manage the user's password and authentication settings.
              </p>
              <button className="w-full bg-white text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">
                Reset Password
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-white/10 transition">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-400 text-sm">
            Activity log coming soon. Here you could track user actions, login
            history, and changes made.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
