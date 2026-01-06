"use client";

import AdminLayout from "../_components/layout";
import Link from "next/link";
import { useState, useMemo } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

type UserRole = "Admin" | "Staff" | "Customer";
type UserStatus = "Active" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

const loggedInUserId = "U001";

const initialUsers: User[] = Array.from({ length: 2 }, (_, i) => ({
  id: `U${String(i + 1).padStart(3, "0")}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Staff", "Customer"][i % 3] as UserRole,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "All">("All");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "All">("All");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === "All" || u.role === filterRole;
      const matchesStatus = filterStatus === "All" || u.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, filterRole, filterStatus, users]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Users</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10 outline-none w-full sm:w-1/3"
          />

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 mt-4">
          <table className="w-full text-sm">
            <thead
              className="bg-[#0B0B0B]
 text-gray-400"
            >
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`border-t border-white/10 ${
                    user.id === loggedInUserId ? "bg-[#1a1a1a]" : "bg-[#121212]"
                  } hover:bg-white/5 transition`}
                >
                  <td className="px-5 py-3 font-medium">{user.name}</td>
                  <td className="px-5 py-3 text-gray-400">{user.email}</td>
                  <td className="px-5 py-3">{user.role}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right flex justify-end gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="p-2 rounded-full bg-[#1a1a1a] hover:bg-white/10 transition"
                      title="View Profile"
                    >
                      <FiEye />
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="p-2 rounded-full bg-[#1a1a1a] hover:bg-white/10 transition"
                      title="Edit User"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      disabled={user.id === loggedInUserId}
                      className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/40 transition"
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
