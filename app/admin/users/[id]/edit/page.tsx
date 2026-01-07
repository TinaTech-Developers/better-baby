"use client";

import AdminLayout from "../../../_components/layout";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

type UserRole = "Admin" | "Staff" | "Customer";
type UserStatus = "Active" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string; // only when resetting password
}

const loggedInUserId = "U001";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // ---------------- FETCH USER ---------------- //
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch user");
          setUser(null);
        } else {
          setUser({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            status: data.user.status,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <p className="text-white p-10">Loading user...</p>
      </AdminLayout>
    );

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

  // ---------------- SAVE USER ---------------- //
  const handleSave = async () => {
    try {
      const body = { ...user }; // now password is allowed
      if (!newPassword) delete body.password;
      else body.password = newPassword;

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update user");
        return;
      }

      toast.success("User updated successfully!");
      setNewPassword("");
      setShowPassword(false);
      router.back();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Edit {user.name} {user.id === loggedInUserId && "(You)"}
          </h2>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Details Form */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-white/10 transition space-y-4">
            <h3 className="text-xl font-semibold mb-2">User Details</h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-gray-400 text-sm">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 outline-none hover:border-white transition"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 outline-none hover:border-white transition"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Role</label>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(e.target.value as UserRole)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 outline-none hover:border-white transition"
                >
                  <option>Admin</option>
                  <option>Staff</option>
                  <option>Customer</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <button
                  onClick={updateStatus}
                  className={`mt-1 px-4 py-2 rounded-full text-sm font-semibold transition ${
                    user.status === "Active"
                      ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  }`}
                >
                  {user.status}
                </button>
              </div>
            </div>
          </div>

          {/* Security / Reset Password */}
          <div className="bg-[#121212] rounded-2xl border border-red-800 p-6 shadow-lg hover:shadow-white/10 transition space-y-4">
            <h3 className="text-xl font-semibold mb-2">Security</h3>
            <p className="text-gray-400 text-sm mb-2">
              Reset or update the user's password.
            </p>

            {showPassword ? (
              <>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // toggle type
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 outline-none hover:border-white transition pr-10"
                  />
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowPassword(false);
                      setNewPassword("");
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowPassword(true)}
                className="w-full bg-white text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
              >
                Reset Password
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:scale-105 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </AdminLayout>
  );
}
