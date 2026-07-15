import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    if (user && user.role !== "ADMIN") { router.push("/dashboard"); return; }
    if (user) fetchUsers();
  }, [user, token]);

  async function fetchUsers() {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deactivateUser(id) {
    if (!confirm("Deactivate this user?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to deactivate user:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">User Management</h1>
        <p className="text-gray-400 mt-1">Manage registered users</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="text-gray-400">#{u.id}</td>
                  <td className="font-medium text-white">{u.name}</td>
                  <td className="text-gray-300">{u.email}</td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                      u.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                      u.isActive
                        ? "bg-green-500/10 text-green-300 border border-green-500/20"
                        : "bg-red-500/10 text-red-300 border border-red-500/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.isActive ? "bg-green-400" : "bg-red-400"}`}></span>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.isActive && u.id !== user?.id && (
                      <button onClick={() => deactivateUser(u.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
