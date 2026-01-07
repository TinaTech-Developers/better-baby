"use client";

import AdminLayout from "../_components/layout";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "All">("All");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "All">("All");

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "Admin",
    status: "Active",
  });

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

  // ---------------- FETCH USERS ---------------- //
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(
            data.users.map((u: any) => ({
              id: u._id,
              name: u.name,
              email: u.email,
              role: u.role,
              status: u.status,
            }))
          );
        } else {
          toast.error(data.error || "Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  // ---------------- CREATE USER ---------------- //
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and Email are required!");
      return;
    }

    const password = Math.random().toString(36).slice(-8);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create user");
        return;
      }

      setUsers((prev) => [...prev, { ...newUser, id: data.user._id }]);
      setShowCreateUser(false);
      setNewUser({ name: "", email: "", role: "Customer", status: "Active" });
      toast.success(`User created successfully! Password: ${password}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Users</h2>

        {/* Filters & Create Button */}
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

          <button
            onClick={() => setShowCreateUser(true)}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
          >
            Create User
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 mt-4">
          <table className="w-full text-sm">
            <thead className="bg-[#0B0B0B] text-gray-400">
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

      {/* ---------------- CREATE USER MODAL ---------------- */}
      {showCreateUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-[#0f0f0f] border border-white/10 p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="text-lg font-semibold">Create New User</h3>
              <button
                onClick={() => setShowCreateUser(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10 outline-none"
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as UserRole })
                }
                className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10"
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Customer">Customer</option>
              </select>
              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    status: e.target.value as UserStatus,
                  })
                }
                className="px-4 py-2 rounded-lg bg-[#121212] border border-white/10"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreateUser(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </AdminLayout>
  );
}
